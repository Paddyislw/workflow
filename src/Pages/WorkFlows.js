import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchModules,
  fetchWorkflow,
  selectModules,
  selectWorkflow,
} from "../Redux/WorkFlowSlice";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { Sidebar } from "./Sidebar";
import "./index.css";
import ModuleButton from "../Components/ModuleButton";
import clsx from "clsx";

let id = 0;
const getId = () => `${id++}`;

const WorkFlows = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const workFlowState = useSelector(selectWorkflow);
  const moduleState = useSelector(selectModules);
  const { data: workFlow, fetched: workFlowFetched } = workFlowState;
  const reactFlowWrapper = useRef(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { data: modules, loading, fetched, error } = moduleState;
  const initialNodes = [];
  const idsOfRed = edges.map((e) => {
    return e.target;
  });

  useEffect(() => {
    if (workFlowFetched) {
      setNodes([
        {
          id: workFlow.id,
          position: { x: 500, y: 50 },
          data: {
            label: (
              <div className=" input border-2 border-gray-400 flex justify-between items-center  cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    d="M12 11V8L16 12L12 16V13H8V11H12ZM12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20Z"
                    fill="#000"
                  ></path>
                </svg>
                <p className="text-gray-600 text-xs border-r-2 border-gray-400 border-l-2 bg-[#d6f1ec] grow  text-center py-1">
                  {workFlow.name}
                </p>
                <p className="font-bold px-2">
                  {workFlow.input_type?.toUpperCase()}
                </p>
              </div>
            ),
          },
          type: "input",
          style: {
            padding: "0px",
            width: "250px",
          },
        },
      ]);
    }
  }, [workFlowFetched]);

  const hasInputEdge = (nodeId) => {
    const elements = [...nodes, ...edges];
    const node = elements.find((el) => el.id === nodeId);
    const inputPorts = node?.data?.ports?.filter(
      (port) => port.type === "input"
    );
    if (!inputPorts) return false;
    const connectedEdges = elements.filter((el) => el.source === nodeId);
    return connectedEdges.length > 0;
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [idsOfRed, edges]
  );

  //useEffect to identify the nodes state
  useEffect(() => {
    if (workFlowFetched && nodes.length !== 1 && nodes.length) {
      setNodes((prev) => {
        return prev.map((e) => {
          let idsOfRedz = edges.map((e) => {
            return e.target;
          });

          if (e.id === workFlow.id) {
            return e;
          } else if (!idsOfRedz.includes(e.id) && e.id !== "17" && e) {
            return {
              ...e,
              data: {
                ...e.data,
                label: (
                  <RedNode
                    name={e.data.value?.name}
                    input={e.data.value?.input}
                    output={e.data.value?.output}
                  />
                ),
              },
            };
          } else {
            return {
              ...e,
              data: {
                ...e.data,
                label: (
                  <DefaultNode
                    name={e.data.value?.name}
                    input={e.data.value?.input}
                    output={e.data.value?.output}
                  />
                ),
              },
            };
          }
        });
      });
    }
  }, [edges, nodes.length]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const name = event.dataTransfer.getData("name");
      const input = event.dataTransfer.getData("input");
      const output = event.dataTransfer.getData("output");
      const id = event.dataTransfer.getData("id");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      let idOfNode = getId();
      const newNode = {
        id: idOfNode,
        type,
        position,
        data: {
          label: <DefaultNode name={name} input={input} output={output} />,
          value: {
            name,
            input,
            output,
          },
        },
        style: {
          padding: "0px",
          width: "250px",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    dispatch(fetchWorkflow(id));
    dispatch(fetchModules());
  }, []);

  return workFlowFetched && !error ? (
    <div
      style={{
        width: "100%",
        height: "90%",
        margin: " 0",
        padding: "0",
        boxSizing: "border-box",
      }}
    >
      <div className="p-4 border-b-2 border-gray-600">
        <p className="font-bold text-lg">
          WorkFlow name: <span className="font-normal">{workFlow.name}</span>
        </p>
      </div>

      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            >
              <Controls />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
          <Sidebar />
        </ReactFlowProvider>
      </div>
    </div>
  ) : loading && !error ? (
    <div className="flex justify-center items-center h-full">
      <div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  ) : (
    error && (
      <p className="text-2xl text-center font-bold text-red-500">
        Too Many Requests . Please Try Sometime later
      </p>
    )
  );
};

const DefaultNode = ({ name, input, output }) => (
  <div
    className={clsx(
      "input border-2 border-gray-400 flex justify-between items-center  cursor-pointer"
    )}
  >
    <p className="  font-bold px-2">{input?.toUpperCase()}</p>
    <p className="text-gray-600 text-xs border-r-2 border-gray-400 border-l-2 bg-[#d6f1ec] grow  text-center py-1">
      {name}
    </p>
    <p className="font-bold px-2">{output?.toUpperCase()}</p>
  </div>
);

const RedNode = ({ name, input, output }) => (
  <div
    className={clsx(
      "input border-2 border-red-500 flex justify-between items-center  cursor-pointer"
    )}
  >
    <p className="  font-bold px-2">{input?.toUpperCase()}</p>
    <p className="text-gray-600 text-xs border-r-2 border-gray-400 border-l-2 bg-[#d6f1ec] grow  text-center py-1">
      {name}
    </p>
    <p className="font-bold px-2">{output?.toUpperCase()}</p>
  </div>
);

export default WorkFlows;
