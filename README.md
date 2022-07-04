<link href="style.css" rel="stylesheet" />

- [NextJS](#nextjs)
    - [Static Assets](#static-assets)
  - [Pre Rendering and Data Fetching](#pre-rendering-and-data-fetching)
    - [getStaticProps() - Static Generation](#getstaticprops---static-generation)
    - [getServerSideProps - Server Side Rendering](#getserversideprops---server-side-rendering)
- [Dynamic Routing](#dynamic-routing)
  - [API Routes](#api-routes)

# NextJS

<ul>

<li><a href="https://rauchg.com/2014/7-principles-of-rich-web-applications">7 Principles of Rich Web Applications - Amazing </a>

<li>Launching New App </li>

</br>

```
npx create-next-app@latest --ts

npm run dev // starting dev build

```

</br>

<li>Set up <k>TailwindCSS</k>  </li>

</br>

```
// Setup tailwind

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Change tailwind.config.js to :

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

Add Tailwind Directives to CSS -  ./styles/globals.css

@tailwind base;
@tailwind components;
@tailwind utilities;

```

</br>

<li><k>Routing</k>  </li>

<li>In Next.js, a page is a React Component exported from a file in the pages directory.  </li>

<li> <code>pages/index.js</code> is associated with the <k>' / '</k> route </li>

<li><code>pages/posts/first-post.js</code> is associated with the <k>' /posts/first-post '</k> route  </li>

<li>To create a new Page , under pages we can create a Posts folder and create first-post.tsx.  </li>

</br>

```
pages/posts/first-post.tsx :

export default function FirstPost() {
  return (
    <h1 className="text-3xl text-white w-6/12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      First Post
    </h1>
  );
}

Now when we visit localhost:3000/posts/first-post we see the component

```

</br>

<li><k>Link</k> component to transition between pages  </li>

</br>

```
import Link from 'next/link';

```

</br>

<li>NextJS only loads JS required for particular Path - when it sees a Link element , it will begin prefetching the content for that component  </li>

### Static Assets

<li>NextJS by default will lazy load images and optimize images.  </li>

<li>Static assets can be placed in the <k>public </k> folder.  </li>

<li>Use <k>next/image</k> for Image components in NextJS </li>

</br>

```
import Image from 'next/image';

const YourComponent = () => (
  <Image
    src="/images/profile.jpg" // Route of the image file
    height={144} // Desired size with correct aspect ratio
    width={144} // Desired size with correct aspect ratio
    alt="Your Name"
  />
);

```

</br>

<li>Changing the <k>Head</k> of a Page.  </li>

</br>

```
We can use the Head component to easily have dynamic titles and metadata for our pages.

import Head from 'next/head';

export default function FirstPost() {
  return (
    <>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </>
  );
}

```

</br>

<li> Using <k>Custom CSS</k> </li>

</br>

```

If we have a Component :
Layout.tsx :

const Layout: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
export default Layout;

=============
=============

Create a file layout.module.css :

.container {
  max-width: 36rem;
  padding: 0 1rem;
  margin: 3rem auto 6rem;
}

=============
=============

Import styles from the module and add class to the div

Layout.tsx :

import styles from "./layout.module.css";

const Layout: React.FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Layout;

```

</br>

## Pre Rendering and Data Fetching

<li> <k>Prerendering</k> : By default, Next.js pre-renders every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Pre-rendering can result in better performance and SEO. </li>

<li> 2 types of Pre Rendering   </li>

<li> <k>Static Generation (Recommended)</k> : The HTML is generated at build time and will be reused on each request. </li>

<li><k>Server-side Rendering </k>: The HTML is generated on each request.  </li>

### getStaticProps() - Static Generation

<li> <k>getStaticProps()</k> can be defined and exported as an async function - this will tell Next.JS that the component has some external dependencies and to run the function before prerendering the page at build time. </li>

<li> For example , we can use getStaticProps() to parse the names of two markdown files from our local system and pass it to a component at run time. </li>

<li><span>YAML </span> & <span> Grey Matter </span>package  </li>

</br>

```
Gray Matter is a module that helps us parse metadata from md files
npm install gray-matter

Example md file :
pre-rendering.md :

---
title: 'Two Forms of Pre-rendering'
date: '2020-01-01'
---

Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
- **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.

Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

---
The section in the top between the --- is the Metadata for YAML files.

```

</br>

<li>We can create a <k>lib</k> or <k>utils</k> top level folder to implement our server side Logic.  </li>

 </br>
 
 ```
 Created lib/posts.tsx

This file will read the names of the markdown files in the directory , parse metadata from them , and return a sorted array with the date , title , and id (title) props.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface Metadata {
id: string;
title: string;
date: string;
}

type Posts = Metadata[];

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
const fileNames = fs.readdirSync(postsDirectory);
const allPostsData = fileNames.map((fileName) => {
// remove .md from filename to get id
const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      date: matterResult.data.date,
      title: matterResult.data.title,
    };

});

// Sort posts by date
return allPostsData.sort((a, b) => {
if (a.date < b.date) {
return 1;
} else if (a > b) {
return -1;
} else {
return 0;
}
});
}

```

</br>

<li>In our <span>index.tsx</span> file , we imported the <span>getSortedPostsData</span> func and we will use this in <span>getStaticProps()</span>  </li>

</br>

```

1. We create a getStaticProps function and call the logic we want (fetching) and export the result from getStaticProps function. For ex: return {props : posts}

2. In our main component , destructure posts directly from the props object and thus we can use it.

Ex :
index.tsx :

import { getSortedPostsData } from "../lib/posts";
import { GetStaticProps } from "next";

const Home: NextPage = ({
allPostsData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
return (

<div className={styles.container}>
<Head>
<title>Create Next App</title>
<meta name="description" content="Generated by create next app" />
<link rel="icon" href="/favicon.ico" />
</Head>

      <main className={styles.main}>


        <section className="">
          <h2 className="text-2xl mt-4">Blog</h2>
          <ul className="mt-2">
            {allPostsData.map(({ id, date, title }: Metadata) => (
              <li className="mb-2" key={id}>
                {title}
                <br />
                {id}
                <br />
                {date}
              </li>
            ))}
          </ul>
        </section>


      </main>
    </div>

);
};

export default Home;

export const getStaticProps: GetStaticProps = () => {
const allPostsData: Posts = getSortedPostsData();
return {
props: {
allPostsData,
},
};
};

```

</br>

<li><code>getStaticProps()</code> runs <strong>directly on the server</strong> and will <strong>NOT</strong> be included in the JS bundle. Hence , we can make DB queries directly from it.  </li>

<li> For <strong>Development</strong> - <k>getStaticProps</k> runs on every request. </li>

<li> For <strong>Production</strong> - <k>getStaticProps</k> runs only on build time. </li>

<li>getStaticProps can only be exported from a <strong>page</strong> - this is because React needs to have all of the required data before the page is rendered.  </li>

### getServerSideProps - Server Side Rendering

<li> <code>getServerSideProps</code> </li>

</br>

```

export async function getServerSideProps(context) {
return {
props: {
// props for your component
},
};
}

```

</br>

<li>Because getServerSideProps is called at request time, its parameter <span>(context)</span> contains request specific parameters.  </li>

<li><k>Client Side Rendering</k> - Statically generate (pre-render) parts of the page that do not require external data & fetch external data from the client using SSR  </li>

<li> <k>SWR</k> - React hook for Data fetching by NextJS team </li>

# Dynamic Routing

<li> NextJS supports creating dynamic routes for pages. </li>

<li> For example if we have several posts such as <code>["post1" , "post2" , "post3"]</code> we can use <k>NextJS</k> to generate a route for every post such as <code>/posts/post1</code> , <code>/posts/post2</code> , and  <code>/posts/post3</code> </li>

<li> There are 3 steps involved to do this </li>

<ul>

<li>If we want to generate a page at a path for <span>posts/${id}</span> </li>

<li>1. Create a Page at <span> /pages/posts/[id].tsx</span>  </li>

<li>2. This file must contain :  </li>

<li>> A React Component  </li>

<li> ><code>getStaticPaths()</code> function which returns an array of possible id's </li>

<li>><code> getStaticProps</code> - which fetches neccessary data for every post with id </li>


</ul>

</br>

<li>Create a file <span>[id].tsx</span> in <k>pages/posts</k> directory.  </li>

</br>

```

import Layout from "../../components/Layout";

export const Post: NextPage = () => {
return <Layout>...</Layout>;
};

```

</br>

<li>Update lib/posts.tsx to add a <span>getPostsByIds</span> function   </li>

</br>

```

Note - the array we must export must be in the form of :
[ {params : {id : 'ssg-ssr'}} , {params : {id : 'post2'}} ] or it will fail.

export function getAllPostIds() {
const fileNames = fs.readdirSync(postsDirectory);

// Returns an array that looks like this:
// [
// {
// params: {
// id: 'ssg-ssr'
// }
// },
// {
// params: {
// id: 'pre-rendering'
// }
// }
// ]
return fileNames.map((fileName) => {
return {
params: {
id: fileName.replace(/\.md$/, ""),
},
};
});
}

````

</br>


<li><strong>Note:</strong> The returned list is not just an array of strings — it must be an array of objects that look like the comment above. Each object must have the params key and contain an object with the id key (because we’re using [id] in the file name). Otherwise, getStaticPaths will fail.  </li>

<li>Update <span>[id].tsx</span>  </li>

</br>

```js
import Layout from "../../components/Layout";
import type { InferGetStaticPropsType, NextPage } from "next";

import { getAllPostIds, getPostData } from "../../lib/posts";

const Post = ({ postData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
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

export const getStaticProps = ({ params }: any) => {
  const postData = getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};

export default Post;

```

</br>

<li> Important note on <code>getStaticProps</code> for <k>dynamic routing</k> </li>

</br>

```ts
// Params will be the file name - since it is [id].tsx , params.id === id

export const getStaticProps = ({ params }: any) => {
  const postData = getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};
```

</br>

<li>Process for Dynamic Routing   </li>

</br>

```
1. [id].tsx - if we have several posts we want to create routes for in pages/posts/
2. In [id].tsx , define a React Component and getStaticProps function - the getStaticProps can for example read the id from current URL and use it to pull the data for a post
3. In [id].tsx , use getStaticPaths() to return a list of all the possible routes
```

</br>

<li>To render <k>Markdown</k> we can use <span> remark </span> and <span>remark-html</span> libraries  </li>

</br>

```
npm install remark remark-html

remark transforms Markdown into HTML that we can use in our Components.

```

</br>

<li>We can use <k>date-fns</k> package to format the date.  </li>

</br>

```
npm install date-fns
```

</br>

<li> Create function to convert string into proper Date  </li>

</br>

```ts
import { parseISO, format } from "date-fns";

interface Date {
  dateString: string;
}

export default function Date({ dateString }: Date) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;
}

```

</br>

<li>Then in our dynamic component , import the file and simply use the function.  </li>

</br>

```ts
import Date from "../../components/date";

const Post = ({ postData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>

      <Date dateString={postData.date} /> <br />

      <br />

      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      <Link href="/">Back</Link>
    </Layout>
  );
};
```

</br>

## API Routes

<li> API Routes let you create an <k>API endpoint</k> inside a Next.js app. You can do so by creating a function inside the <span>pages/api</span> directory that has the following format: </li>

</br>

```js
// req = HTTP incoming message, res = HTTP server response
export default function handler(req, res) {
  // ...
}
```

</br>

<li> Create a simple page <code>Hello.tsx</code> under pages/api : </li>

</br>

```ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}



```

</br>

<li>If we go to <code>localhost:3000/api/hello</code> we will see the JSON output from the API  </li>

<li><strong>Note:</strong> Never fetch from API routes in <span>getStaticProps</span> or <span>getStaticPaths</span>.  </li>

<li>Instead , write server code directly in  <span>getStaticProps</span> or <span>getStaticPaths</span> </li>

<li><k>Good Use Case</k> - Handling Form Inputs  </li>

<li> We can create a form on the page and send a <span>POST</span> request to the API Route. </li>

<li>Within API Routes code , we can save directly to the DB because the API Route Code will not be part of the client bundle.  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

<li>  </li>

</ul>
````
