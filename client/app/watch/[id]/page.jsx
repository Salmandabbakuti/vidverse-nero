export default async function Video({ params }) {
  const { id } = await params;
  return (
    <div>
      <h1>Video ID: {id}</h1>
      <p>This is the video page for video ID: {id}</p>
      {/* Add more content here */}
    </div>
  );
}
