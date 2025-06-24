import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard, Button } from "../components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        if (userData) {
            appwriteService
                .getPosts()
                .then((posts) => {
                    if (posts) {
                        const userPosts = posts.documents.filter(
                            (post) => post.userId === userData.$id
                        );
                        setPosts(userPosts);
                    }
                })
                .catch((err) => console.error("Error fetching posts:", err));
        }
    }, [userData]);

    return (
        <div className="w-full py-8">
            {/* Hero / Landing Section */}
            <section className="w-full text-center py-16 px-4  text-black rounded-xl mb-12">
                <Container>
                    <h1 className="text-4xl font-bold mb-4">Welcome to Narrativ</h1>
                    <p className="text-lg mb-6">
                        Share your thoughts, stories & ideas. Your voice matters.
                    </p>
                    {userData ? (
                        <Link to="/add-post">
                            <Button className="bg-black text-white">
                                Write Your Story
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button className="bg-white text-black hover:bg-gray-200">
                                Login to Start Writing
                            </Button>
                        </Link>
                    )}
                </Container>
            </section>

            {/* User's Posts Section */}
            <Container>
                <h2 className="text-2xl font-semibold mb-6 font-sans text-gray-600 ">
                    {userData ? "Your Posts" : ""}
                </h2>

                {userData ? (
                    posts.length > 0 ? (
                        <div className="flex flex-wrap -mx-2">
                            {posts.map((post) => (
                                <div key={post.$id} className="p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                                    <PostCard {...post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No posts yet. Start writing!</p>
                    )
                ) : (
                    <div className="text-center">
                        <Link to="/login">
                            <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                                Login to view posts
                            </Button>
                        </Link>
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Home;
