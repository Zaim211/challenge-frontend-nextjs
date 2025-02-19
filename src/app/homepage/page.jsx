"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Image from "next/image";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState({});
  const [page, setPage] = useState(1);
  const perPage = 36;
  const API_KEY = "6-V0yw9HkpNYxVcrByA8HGuEGPzocL3GSwLpCWP9XFI";

  useEffect(() => {
    fetchImages(page);
    loadLikedPhotos();
  }, [page]);

  // Fetch images from Unsplash API
  const fetchImages = async (pageNumber) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/?client_id=${API_KEY}&page=${pageNumber}&per_page=${perPage}`
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // store liked photos on localStorage
  const loadLikedPhotos = () => {
    const storedLikes = JSON.parse(localStorage.getItem("likedPhotos")) || {};
    setLikedPhotos(storedLikes);
  };

  // Handle like/unlike toggle
  const toggleLike = (photoId) => {
    const updatedLikes = { ...likedPhotos };
    if (updatedLikes[photoId]) {
      delete updatedLikes[photoId]; //  if Unlike
    } else {
      updatedLikes[photoId] = true; // if Like
    }
    setLikedPhotos(updatedLikes);
    localStorage.setItem("likedPhotos", JSON.stringify(updatedLikes));
  };

  return (
    <div className="p-16 w-max-2xl">
      <h1 className="text-2xl font-bold text-center mb-4">Image Gallery</h1>
      <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
          <div key={image.id} className="relative">
            <Image
              src={image.urls.small}
              alt={image.alt_description || "Unsplash image"}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => toggleLike(image.id)}
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
            >
              <FaHeart size={20} className={likedPhotos[image.id] ? "text-red-500" : "text-gray-400"} />
            </button>
          </div>
        ))}
      </div>
 
      <div className="flex justify-center mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-300 rounded-l">
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200">{page}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === 3} className="px-4 py-2 bg-gray-300 rounded-r">
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;

