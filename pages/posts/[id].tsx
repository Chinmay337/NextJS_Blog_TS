import Layout from "../../components/Layout";
import type { InferGetStaticPropsType, NextPage } from "next";

import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import Link from "next/link";
import Head from "next/head";

// import { GetStaticProps } from "next";

// interface Metadata {
//   id: string;
//   title: string;
//   date: string;
// }

// type Posts = Metadata[];

const Post = ({ postData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div className="font-bold">{postData.title}</div>
      <br />
      {postData.id}
      <br />
      <Date dateString={postData.date} /> <br />
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      <Link href="/">Back</Link>
    </Layout>
  );
};

export const getStaticPaths = () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};

export default Post;
