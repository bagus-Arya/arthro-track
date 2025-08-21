import { Redirect } from "expo-router";

const index = () => {
  return (
    <>
      <Redirect href="/get_started" />
    </>
  );
};

export default index;
