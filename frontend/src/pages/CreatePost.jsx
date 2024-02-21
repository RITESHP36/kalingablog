import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { storage } from "../components/firebase";

const CreatePost = () => {
	const { user } = useContext(UserContext);
	// const { user, name, phoneNumber, registerNumber, email } = useContext(UserContext);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [introductionImage, setIntroductionImage] = useState("");
	const [blogImages, setBlogImages] = useState([]);
	const [subBodyImage, setSubBodyImage] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [introduction, setIntroduction] = useState("");
	const [body, setBody] = useState("");
	const [subBody, setSubBody] = useState("");
	const [conclusion, setConclusion] = useState("");
	const [faqs, setFaqs] = useState("");
	const [writerDetails, setWriterDetails] = useState("");
	const [sources, setSources] = useState("");

	const navigate = useNavigate();

	// Uploading image and url generration function into firebase
	const uploadImage = (img) => {
		return new Promise((resolve, reject) => {
			if (img == null) {
				reject("No image provided");
				return;
			}

			const uploadTask = storage.ref(`images/${img.name}`).put(img);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					reject(error.message);
				},
				() => {
					uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	// Function to handle introduction image change
	const handleIntroductionImageChange = async (e) => {
		const file = e.target.files[0];
		try {
			const url = await uploadImage(file);
			setIntroductionImage(url);
		} catch (error) {
			console.log("Introduction image upload failed:", error);
		}
	};

	// Function to handle blog image change
	const handleBlogImageChange = async (e) => {
		const files = e.target.files;
		const newBlogImages = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				const url = await uploadImage(file);
				newBlogImages.push(url);
			} catch (error) {
				console.log("Blog image upload failed:", error);
			}
		}
		setBlogImages(newBlogImages);
	};

	// Function to handle sub-body image change
	const handleSubBodyImageChange = async (e) => {
		const file = e.target.files[0];
		try {
			const url = await uploadImage(file);
			setSubBodyImage(url);
		} catch (error) {
			console.log("Sub-body image upload failed:", error);
		}
	};

	const handleCreate = async (e) => {
		e.preventDefault();

		const post = {
			title,
			desc,
			username: user.username,
			userId: user._id,
			category: selectedCategory,
			introduction,
			body,
			subBody,
			conclusion,
			faqs,
			writerDetails,
			sources,
			introductionImage,
			blogImages,
			subBodyImage,
		};

		try {
			const res = await axios.post(URL + "/api/posts/create", post, {
				withCredentials: true,
			});
			navigate("/posts/post/" + res.data._id);
		} catch (err) {
			console.error(err);
		}
	};

	const categories = ["Category 1", "Category 2", "Category 3"];

	return (
		<div>
			<Navbar />
			<div className="px-6 md:px-[200px] mt-8">
				<h1 className="font-bold md:text-2xl text-xl ">Create a post</h1>
				<form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="px-4 py-2 outline-none"
					>
						<option value="">Select a category</option>
						{categories.map((category, index) => (
							<option key={index} value={category}>
								{category}
							</option>
						))}
					</select>
					<input
						onChange={(e) => setTitle(e.target.value)}
						type="text"
						placeholder="Enter title"
						className="px-4 py-2 outline-none"
					/>
					<input
						onChange={(e) => setDesc(e.target.value)}
						type="text"
						placeholder="Enter description"
						className="px-4 py-2 outline-none"
					/>
					<input type="file" onChange={handleIntroductionImageChange} />
					{introductionImage && (
						<img src={introductionImage} alt="Introduction" />
					)}
					<textarea
						onChange={(e) => setIntroduction(e.target.value)}
						rows={5}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter introduction"
					/>
					{/* Input field for the blog image */}
					<input type="file" multiple onChange={handleBlogImageChange} />
					{blogImages.map((image, index) => (
						<div key={index}>
							<img src={image} alt={"Blog Image " + (index + 1)} />
						</div>
					))}

					<textarea
						onChange={(e) => setBody(e.target.value)}
						rows={15}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter body"
					/>
					<textarea
						onChange={(e) => setSubBody(e.target.value)}
						rows={10}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter sub body"
					/>
					<input type="file" onChange={handleSubBodyImageChange} />
					{subBodyImage && <img src={subBodyImage} alt="Sub Body" />}

					<textarea
						onChange={(e) => setConclusion(e.target.value)}
						rows={5}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter conclusion"
					/>
					<textarea
						onChange={(e) => setFaqs(e.target.value)}
						rows={5}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter FAQs"
					/>
					<textarea
						onChange={(e) => setWriterDetails(e.target.value)}
						rows={5}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter writer details"
					/>
					<textarea
						onChange={(e) => setSources(e.target.value)}
						rows={5}
						cols={30}
						className="px-4 py-2 outline-none"
						placeholder="Enter sources"
					/>
					<button
						onClick={handleCreate}
						className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg"
					>
						Create
					</button>
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default CreatePost;
