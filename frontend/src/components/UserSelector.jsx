import { useState } from "react";

export default function UserSelector() {
  const [userId, setUserId] = useState(() => { const savedId = localStorage.getItem("borrower_id"); return savedId || ""; });

  function handleChange(e) {
    const inputText = e.target.value;
    setUserId(inputText);
    localStorage.setItem("borrower_id", inputText);
  }

  return (
    <div className="user-selector">
      <label htmlFor="userId" className="user-selector__label" >User ID:</label>
      <input
        id="userId"
        className="user-selector__input"
        value={userId}
        onChange={handleChange}
        placeholder="123"
      />
    </div>
  )
}