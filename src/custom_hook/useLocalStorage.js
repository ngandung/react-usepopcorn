import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const localData = localStorage.getItem(key);
    //JSON.parse digunakan untuk mengembalikan format data dari string ke format semula
    return localData ? JSON.parse(localData) : initialState;
  });

  //Save watched list to browser storage
  useEffect(
    function () {
      //local storage hanya menyimpan data dalam bentuk string, jadi perlu di JSON.stringify dulu
      localStorage.setItem(key, JSON.stringify(value));
    },

    [value,key]
  );

  return [value, setValue];
}
