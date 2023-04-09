import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModules, selectModules } from "../Redux/WorkFlowSlice";
import ModuleButton from "../Components/ModuleButton";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const moduleState = useSelector(selectModules);
  const { data: modules, loading } = moduleState;
  useEffect(() => {
    dispatch(fetchModules());
  }, []);
  return (
    <div className="space-y-3 p-2 border-l-2 border-gray-500">
      <p className="pl-1 text-lg font-mono text-gray-500">Modules:</p>
      {modules.map((e) => (
        <ModuleButton module={e} />
      ))}
    </div>
  );
};
