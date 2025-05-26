// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract VidVerse is ERC721 {
    using Strings for uint256;
    uint256 public nextVideoId;
    string private constant BASE_URI = "https://ipfs.io/ipfs/";

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
        uint256 tipAmount;
        uint256 tipsCount;
        uint256 commentsCount;
        uint256 likesCount;
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

    mapping(uint256 id => Video video) public videos;
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

    constructor() ERC721("VidVerse", "VID") {}

    modifier onlyExistingVideo(uint256 _videoId) {
        require(videos[_videoId].owner != address(0), "Video does not exist");
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
            _eoa,
            0,
            0,
            0,
            0
        );
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
        address videoOwner = video.eoa; // Use the EOA address for tipping. owner can be smart account
        require(videoOwner != msg.sender, "You cannot tip your own video");
        require(_amount > 0, "Tip amount must be greater than 0");
        require(msg.value == _amount, "Tip amount must match value");
        video.tipAmount += _amount;
        uint256 tipId = video.tipsCount++;
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
        uint256 commentId = videos[_videoId].commentsCount++;
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
            videos[_videoId].likesCount--;
            isVideoLikedByUser[_videoId][msg.sender] = false;
            isLiked = false;
        } else {
            videos[_videoId].likesCount++;
            isVideoLikedByUser[_videoId][msg.sender] = true;
            isLiked = true;
        }
        emit VideoLikeToggled(_videoId, msg.sender, isLiked);
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
    ) public view override returns (string memory) {
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
            video.likesCount.toString(),
            '", "comments":"',
            video.commentsCount.toString(),
            '", "tips":"',
            video.tipAmount.toString(),
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
