// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract VidVerse is ERC721 {
    using Strings for uint256;
    uint256 public nextVideoId;
    // report threshold for flagging a video
    uint8 public constant REPORT_THRESHOLD = 3;
    string private constant BASE_URI = "https://ipfs.io/ipfs/";
    address public immutable moderator;

    // Video information
    struct Video {
        uint256 id;
        string title;
        string description;
        string category;
        string location;
        string thumbnailHash;
        string videoHash;
        address owner;
        address eoa;
    }

    // Video statistics
    struct VideoStats {
        uint256 videoId;
        uint256 tipsCount;
        uint256 tipAmount;
        uint256 commentsCount;
        uint256 likesCount;
        uint256 reportsCount;
        bool isFlagged;
        bool isRemoved;
    }

    struct Tip {
        uint256 id;
        uint256 videoId;
        uint256 amount;
        address from;
    }

    struct Comment {
        uint256 id;
        uint256 videoId;
        string comment;
        address author;
    }

    enum ReportReason {
        SexualContent,
        ViolentOrRepulsive,
        HatefulOrAbusive,
        HarmfulOrDangerousActs,
        Misinformation,
        ChildAbuse,
        SpamOrMisleading,
        Legal,
        Other
    }

    struct Report {
        uint256 id;
        uint256 videoId;
        ReportReason reason;
        string description;
        address reporter;
    }

    mapping(uint256 id => Video video) public videos;
    // video stats
    mapping(uint256 videoId => VideoStats stats) public videoStats;
    // reports
    mapping(uint256 videoId => Report[] reports) public videoReports;
    // tips
    mapping(uint256 videoId => mapping(uint256 tipId => Tip)) public tips;
    // comments
    mapping(uint256 videoId => mapping(uint256 commentId => Comment))
        public comments;
    //  likes
    mapping(uint256 videoId => mapping(address user => bool isLiked))
        public isVideoLikedByUser;

    event VideoAdded(
        uint256 indexed id,
        string title,
        string description,
        string category,
        string location,
        string thumbnailHash,
        string videoHash,
        address indexed owner,
        address indexed eoa
    );

    event VideoInfoUpdated(
        uint256 indexed id,
        string title,
        string description,
        string category,
        string location,
        string thumbnailHash
    );

    event VideoTipped(
        uint256 indexed id,
        uint256 indexed videoId,
        uint256 amount,
        address indexed from
    );

    event VideoLikeToggled(
        uint256 indexed videoId,
        address indexed user,
        bool isLiked
    );
    event VideoCommented(
        uint256 indexed id,
        uint256 indexed videoId,
        string comment,
        address indexed author
    );

    event VideoReported(
        uint256 indexed id,
        uint256 indexed videoId,
        ReportReason reason,
        string description,
        address indexed reporter
    );

    event VideoRemoved(uint256 indexed id);

    event VideoFlagToggled(uint256 indexed videoId, bool isFlagged);

    constructor() ERC721("VidVerse", "VID") {
        moderator = msg.sender;
    }

    modifier onlyExistingVideo(uint256 _videoId) {
        require(
            videos[_videoId].owner != address(0) &&
                videoStats[_videoId].isRemoved == false,
            "Video does not exist"
        );
        _;
    }

    modifier onlyModerator() {
        require(
            msg.sender == moderator,
            "Only moderator can perform this action"
        );
        _;
    }

    function addVideo(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _location,
        string memory _thumbnailHash,
        string memory _videoHash,
        address _eoa
    ) external {
        require(bytes(_videoHash).length > 0, "Video hash cannot be empty");
        require(
            bytes(_thumbnailHash).length > 0,
            "Thumbnail hash cannot be empty"
        );
        require(bytes(_title).length > 0, "Title cannot be empty");
        uint256 videoId = nextVideoId++;
        videos[videoId] = Video(
            videoId,
            _title,
            _description,
            _category,
            _location,
            _thumbnailHash,
            _videoHash,
            msg.sender,
            _eoa
        );

        // initialize video stats
        videoStats[videoId] = VideoStats({
            videoId: videoId,
            tipsCount: 0,
            tipAmount: 0,
            commentsCount: 0,
            likesCount: 0,
            reportsCount: 0,
            isFlagged: false,
            isRemoved: false
        });
        // mint an NFT for the video to eoa
        _safeMint(_eoa, videoId);
        emit VideoAdded(
            videoId,
            _title,
            _description,
            _category,
            _location,
            _thumbnailHash,
            _videoHash,
            msg.sender,
            _eoa
        );
    }

    function updateVideoInfo(
        uint256 _videoId,
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _location,
        string memory _thumbnailHash
    ) external onlyExistingVideo(_videoId) {
        Video storage video = videos[_videoId];
        require(
            video.owner == msg.sender || video.eoa == msg.sender,
            "Only Video owner or EOA can update video info"
        );
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(
            bytes(_thumbnailHash).length > 0,
            "Thumbnail hash cannot be empty"
        );
        video.title = _title;
        video.description = _description;
        video.category = _category;
        video.location = _location;
        video.thumbnailHash = _thumbnailHash;
        emit VideoInfoUpdated(
            _videoId,
            video.title,
            video.description,
            video.category,
            video.location,
            video.thumbnailHash
        );
    }

    function tipVideo(
        uint256 _videoId,
        uint256 _amount
    ) external payable onlyExistingVideo(_videoId) {
        Video storage video = videos[_videoId];
        VideoStats storage vidStats = videoStats[_videoId];
        address videoOwner = video.eoa; // Use the EOA address for tipping. owner can be smart account
        require(videoOwner != msg.sender, "You cannot tip your own video");
        require(_amount > 0, "Tip amount must be greater than 0");
        require(msg.value == _amount, "Tip amount must match value");
        vidStats.tipAmount += _amount;
        uint256 tipId = vidStats.tipsCount++;
        tips[_videoId][tipId] = Tip(tipId, _videoId, _amount, msg.sender);
        (bool success, ) = payable(videoOwner).call{value: _amount}("");
        require(success, "Failed to send tip");
        emit VideoTipped(tipId, _videoId, _amount, msg.sender);
    }

    function commentVideo(
        uint256 _videoId,
        string memory _comment
    ) external onlyExistingVideo(_videoId) {
        require(
            bytes(_comment).length > 0 && bytes(_comment).length <= 280,
            "Comment must be between 1 and 280 characters"
        );
        uint256 commentId = videoStats[_videoId].commentsCount++;
        comments[_videoId][commentId] = Comment(
            commentId,
            _videoId,
            _comment,
            msg.sender
        );
        emit VideoCommented(commentId, _videoId, _comment, msg.sender);
    }

    function toggleLikeVideo(
        uint256 _videoId
    ) external onlyExistingVideo(_videoId) returns (bool isLiked) {
        // check if user has already liked the video
        bool isLikedAlready = isVideoLikedByUser[_videoId][msg.sender];
        // toggle like status and update likes count
        if (isLikedAlready) {
            videoStats[_videoId].likesCount--;
            isVideoLikedByUser[_videoId][msg.sender] = false;
            isLiked = false;
        } else {
            videoStats[_videoId].likesCount++;
            isVideoLikedByUser[_videoId][msg.sender] = true;
            isLiked = true;
        }
        emit VideoLikeToggled(_videoId, msg.sender, isLiked);
    }

    function reportVideo(
        uint256 _videoId,
        ReportReason _reason,
        string memory _description
    ) external onlyExistingVideo(_videoId) {
        require(bytes(_description).length <= 300, "Description too long");
        VideoStats storage vidStats = videoStats[_videoId];
        uint256 reportId = vidStats.reportsCount++;
        videoReports[_videoId].push(
            Report(reportId, _videoId, _reason, _description, msg.sender)
        );
        emit VideoReported(
            reportId,
            _videoId,
            _reason,
            _description,
            msg.sender
        );
        // if reports count reaches threshold, flag the video
        if (vidStats.reportsCount >= REPORT_THRESHOLD) {
            vidStats.isFlagged = true;
            emit VideoFlagToggled(_videoId, true);
        }
    }

    function removeVideo(
        uint256 _videoId
    ) external onlyExistingVideo(_videoId) onlyModerator {
        // video must be flagged to be removed
        VideoStats storage vidStats = videoStats[_videoId];
        // uncomment for decentralized moderation
        // require(vidStats.isFlagged, "Video must be flagged to be removed");
        vidStats.isRemoved = true;
        // _burn(_videoId); // Uncomment to remove NFT
        emit VideoRemoved(_videoId);
    }

    function clearVideoFlag(
        uint256 _videoId
    ) external onlyModerator onlyExistingVideo(_videoId) {
        VideoStats storage vidStats = videoStats[_videoId];
        require(vidStats.isFlagged, "Video is not flagged");
        vidStats.isFlagged = false;
        vidStats.reportsCount = 0; // reset reports count
        emit VideoFlagToggled(_videoId, false);
    }

    // override to prevent transfers
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Transfer not allowed");
        return super._update(to, tokenId, auth);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override onlyExistingVideo(tokenId) returns (string memory) {
        require(
            _ownerOf(tokenId) != address(0),
            "URI query for non-existent token"
        );
        return _getTokenURI(tokenId);
    }

    function _getTokenURI(
        uint256 tokenId
    ) internal view returns (string memory) {
        Video memory video = videos[tokenId];
        VideoStats memory vidStats = videoStats[tokenId];

        bytes memory metadataJson = abi.encodePacked(
            '{"name":"',
            video.title,
            '", "description":"',
            video.description,
            '", "external_url":"',
            "https://example.com",
            '", "image":"',
            BASE_URI,
            video.videoHash,
            '", "properties":{',
            '"category":"',
            video.category,
            '", "location":"',
            video.location,
            '", "thumbnail":"',
            BASE_URI,
            video.thumbnailHash,
            '", "likes":"',
            vidStats.likesCount.toString(),
            '", "comments":"',
            vidStats.commentsCount.toString(),
            '", "tips":"',
            vidStats.tipAmount.toString(),
            '"}',
            "}"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(metadataJson)
                )
            );
    }
}
