import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchList,
  fetchModules,
  selectList,
  selectModules,
} from "../Redux/WorkFlowSlice";
import Table from "../Components/Table";

const HomePage = () => {
  const listState = useSelector(selectList);
  const { data, loading, fetched } = listState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchList());
  }, []);

  return (
    <div>
      <p className="text-center text-2xl py-3 font-bold">Table</p>
      <Table data={data} loading={loading} fetched={fetched} />
    </div>
  );
};

export default HomePage;
