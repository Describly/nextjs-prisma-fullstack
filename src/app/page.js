import {get_full_api_path} from "@/utils/api"
import Link from "next/link";
import {Col, Row} from "react-bootstrap";

async function getPostList() {
  const rawResponse = await fetch(get_full_api_path("/api/posts"))
  return (await rawResponse).json()
}


export default async function Home() {
  const posts = await getPostList()
  return (
    <>
      <Row className={"row-cols-2"}>
        {
          posts.map(post => {
            return (
                <>
                  <Col key={post.id}>
                      <div className="py-3">
                          <div className="card bg-light mb-3">
                              <div className="card-header">
                                  <Link href={'/posts/' + post.id} className={'text-decoration-none text-dark'}>{post.title.replace(/\b\w/g, l => l.toUpperCase())}</Link>
                              </div>
                              <div className="card-body">
                                  <p className="card-text">{post.body}</p>
                              </div>
                          </div>
                      </div>
                  </Col>
                </>
            )
          })
        }
      </Row>
    </>
  )
}
