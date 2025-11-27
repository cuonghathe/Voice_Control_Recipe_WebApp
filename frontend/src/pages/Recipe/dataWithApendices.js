import React from "react";
import AppendixDesBox from "../../components/DescriptionBox/AppendixDesBox";

export default function dataWithAppendices(text, appendices) {
  let result = [text];

  appendices.forEach((appendix) => {
    const newResult = [];

    result.forEach((part) => {
      if (typeof part === "string") {
        const escapedKeyWord = appendix.keyWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const splitParts = part.split(new RegExp(`(${escapedKeyWord})`, "gi"));

        splitParts.forEach((p, index) => {
          if (p.toLowerCase() === appendix.keyWord.toLowerCase()) {
            newResult.push(
              <AppendixDesBox keyWord={appendix.keyWord} defintion={appendix.defintion} />
            );
          } else {
            newResult.push(p);
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