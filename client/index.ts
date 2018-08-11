import { client } from "./shared";
import { Hello, HelloResponse } from "./dtos";

const result = document.querySelector("#result")!;

document.querySelector("#Name")!.addEventListener("input", async e => {
  const value = (e.target as HTMLInputElement).value;
  if (value != "") {
    const request = new Hello();
    request.name = value;
    const response = await client.get(request);
    // const response = await client.get<HelloResponse>("/api/hello", request); // call /api/hello instead
    result.innerHTML = response.result;
  } else {
    result.innerHTML = "";
  }
});
