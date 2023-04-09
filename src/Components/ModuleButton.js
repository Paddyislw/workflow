import React from "react";
import "../Pages/index.css";

const ModuleButton = ({ module }) => {
  const onDragStart = (event, nodeType, name, input, output,id) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("name", name);
    event.dataTransfer.setData("input", input);
    event.dataTransfer.setData("output", output);
    event.dataTransfer.setData("id", id);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      onDragStart={(event) =>
        onDragStart(
          event,
          "default",
          module.name,
          module.input_type,
          module.output_type,
          module.id
        )
      }
      className=" input border-2 border-gray-400 rounded-lg flex justify-between w-72 cursor-pointer "
      draggable
    >
      <p className="border-r-2 border-gray-400  font-bold p-2">
        {module.input_type.toUpperCase()}
      </p>
      <p className="text-gray-600 text-sm font-semibold bg-[#d6f1ec] grow p-2 text-center">
        {module.name}
      </p>
      <p className="border-l-2 border-gray-400 font-bold p-2">
        {module.output_type.toUpperCase()}
      </p>
    </div>
  );
};

export default ModuleButton;
