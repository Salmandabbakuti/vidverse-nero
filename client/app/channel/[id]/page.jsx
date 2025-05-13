export default async function Channel({ params }) {
  const { id } = await params;
  return (
    <div>
      <h1>Channel ID: {id}</h1>
      <p>This is the channel page for channel ID: {id}</p>
      {/* Add more content here */}
    </div>
  );
}
