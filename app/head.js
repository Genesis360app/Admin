export default function Head() {
  return (
    <>
      <link rel="icon" href="/favicon.svg" />
      <title>Genesis360 - Admin </title>
      <script
            async
            defer
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          ></script>
    </>
  );
}
