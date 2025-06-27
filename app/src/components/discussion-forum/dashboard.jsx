import React, { useState } from "react";
import { Link } from "react-router-dom";
import Posts from "./Posts";
import ListGroup from "./ListGroup";
import Pagination from "./Pagination";
import Jumotron from "./jumotron";

const Dashboard = ({ user, posts, tags }) => {
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtering posts based on selected tag
  const filtered =
    selectedTag && selectedTag !== "All"
      ? posts.filter((post) => post.tag === selectedTag)
      : posts || [];

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1); // Reset to first page when tag changes
  };

  // Handle post deletion
  const handlePostDelete = (postId) => {
    console.log("Post deleted:", postId);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <React.Fragment>
      <Jumotron />
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="d-flex w-100 justify-content-between m-3">
              <span>Showing {filtered.length} posts.</span>
              {user && (
                <Link to="/new-post">
                  <button
                    type="button"
                    className="btn btn-success"
                    style={{ marginBottom: 20 }}
                  >
                    New Post
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <Posts posts={filtered} onDelete={handlePostDelete} />
          </div>
          <div className="col-3">
            <ListGroup
              items={[]}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>
        </div>
        <Pagination
          itemCount={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
