import { Redirect } from "expo-router";

const index = () => {
  return (
    <>
      <Redirect href="/(tabs)/profile" />
    </>
  );
};

export default index;
