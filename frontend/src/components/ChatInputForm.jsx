import { ArrowUp, Loader, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatInputForm = ({ mutateAsync, isMutating }) => {
  const endRef = useRef(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      const res = await mutateAsync({
        text,
        image: image ? await readFileAsDataURL(image) : null,
      });
      setUserMessage(text);
      setAiResponse(res.aiResponse);
      setText("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("AI response error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) readFileAsDataURL(file).then(setImagePreview);
    else setImagePreview(null);
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      {isMutating && (
        <div className=" flex z-10 justify-center items-center">
          <Loader className="animate-spin" />
        </div>
      )}
      <div ref={endRef} className="pb-48"></div>
      <form
        className="bg-gray absolute bottom-6 w-[90%] lg:w-[60%] flex flex-col rounded-2xl px-2 mx-auto"
        onSubmit={handleSubmit}
      >
        {imagePreview && (
          <div className="relative flex max-w-24 mt-4 ml-2">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="w-full rounded-lg"
            />
            <X
              className="absolute top-1 right-1 cursor-pointer bg-[#605e68] rounded-full p-1 hover:opacity-80"
              size={24}
              onClick={() => {
                setImagePreview(null);
                setImage(null);
              }}
            />
          </div>
        )}
        <textarea
          id="hideScroll"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Ask anything"
          className="w-full resize-none text-lg p-4 rounded-2xl bg-transparent text-[#ececec] outline-none"
        />
        <div className="w-full flex justify-between items-center p-4 gap-2">
          {imagePreview ? (
            <div></div>
          ) : (
            <div>
              <label htmlFor="file" className="cursor-pointer">
                <Paperclip
                  className="cursor-pointer bg-[#605e68] rounded-full p-2 hover:opacity-80"
                  size={32}
                />
              </label>
              <input
                id="file"
                type="file"
                accept="image/jpeg, image/png"
                hidden
                onChange={handleImageChange}
              />
            </div>
          )}
          <button type="submit" disabled={submitting || isMutating}>
            <ArrowUp
              className="cursor-pointer bg-[#605e68] rounded-full p-1 hover:opacity-80"
              size={32}
            />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInputForm;
