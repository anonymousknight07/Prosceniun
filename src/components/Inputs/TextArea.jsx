import React from "react";
import PropTypes from "prop-types";

const TextArea = ({ id, value, onChange, placeholder }) => (
  <textarea
    rows={5}
    id={id}
    className="py-2.5 px-4 border-none focus:outline-none block w-full rounded-lg
    bg-neutral-800 text-neutral-200 placeholder-neutral-500 resize-none"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
};

export default TextArea;