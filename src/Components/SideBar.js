import React from "react";

const SideBar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>
    </aside>
  );
};

{/* <div className="border-2 w-[30%] pb-6  py-2 px-6 h-[91vh]">
          <p className="text-lg text-gray-500">Modules</p>
          <div className=" mt-2 space-y-4">
            {modules.map((item, index) => (
              <ModuleButton module={item} />
            ))}
          </div>
        </div> */}

export default SideBar;
