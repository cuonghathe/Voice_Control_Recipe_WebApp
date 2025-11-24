import React from "react";
import AppendixDesBox from "../../components/DescriptionBox/AppendixDesBox";

export default function dataWithAppendices(text, appendices) {
  let result = [text];

  appendices.forEach((appendix) => {
    const newResult = [];

    result.forEach((part) => {
      if (typeof part === "string") {
        const splitParts = part.split(new RegExp(`\\b${appendix.keyWord}\\b`, "gi"));

        splitParts.forEach((p, index) => {
          newResult.push(p);
          if (index < splitParts.length - 1) {
            newResult.push(
              <AppendixDesBox keyWord={appendix.keyWord} defintion={appendix.defintion}/>
            );
          }
        });
      } else {
        newResult.push(part);
      }
    });

    result = newResult;
  });

  return result;
}
