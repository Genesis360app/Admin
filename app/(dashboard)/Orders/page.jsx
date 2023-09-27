"use client"

// pages/page.jsx

import { useRouter } from 'next/navigation'


function Page() {
  const router = useRouter();
  const { itemId } = router.query; // Access the itemId from the router query

  // You can fetch data related to the item using the itemId
  // For example, you can make an API request to get item details

  return (
    <div>
      <h1>Item Page</h1>
      <p>Item ID: {itemId}</p>
      {/* Display other item details based on the fetched data */}
    </div>
  );
}

export default Page;

