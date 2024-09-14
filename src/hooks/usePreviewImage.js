import { useState } from "react";
import useShowToast from "./useShowToast";

// const usePreviewImage = () => {
//     const [imgUrl, setImgUrl] = useState(null);
//     const showToast = useShowToast();
    
//     useEffect(() => {
//         return () => {
//             // Cleanup function
//             if (imgUrl && imgUrl.startsWith('blob:')) {
//                 URL.revokeObjectURL(imgUrl);
//             }
//         };
//     }, [imgUrl]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file && file.type.startsWith('image/')) {
//             // Sử dụng URL.createObjectURL thay vì FileReader
//             const objectUrl = URL.createObjectURL(file);
//             setImgUrl(objectUrl);
//         } else {
//             showToast("Invalid file type", "Please select an image file", "error");
//             setImgUrl(null);
//         }
//     }

//     return { handleImageChange, imgUrl, setImgUrl };
// }
const usePreviewImage = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
		} else {
			showToast("Invalid file type", " Please select an image file");
			setImgUrl(null);
		}
	};
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImage;