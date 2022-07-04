import Link from "next/link";
import Layout from "../../components/Layout";

export default function FirstPost() {
  return (
    <>
      <h1 className="text-3xl text-white w-6/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        First Post
      </h1>
      <Link href="/">Go Back</Link>
      <Layout>Keepo</Layout>
    </>
  );
}
