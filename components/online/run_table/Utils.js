import React from "react";
import namor from "namor";
// import './index.css';

const range = len => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = () => {
    const statusChance = Math.random();
    return {
        number: Math.floor(statusChance * 10000),
        "lhc-fill": 1342534,
        "b1-stable": "true",
        "b2-stable": "false",
        "b-field": 3.8005,
        events: (Math.random() * 500000).toFixed(0),
        started: "Thu 10-05-18 17:59:43",
        duration: "00:00:21:23",
        class: ["Collisions", "Cosmics", "Commissioning"][
        (Math.random() * 3).toFixed(0)
        ],
        firstName: namor.generate({ words: 1, numbers: 0 }),
        lastName: namor.generate({ words: 1, numbers: 0 }),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status:
        statusChance > 0.66
            ? "relationship"
            : statusChance > 0.33 ? "complicated" : "single"
    };
};

export function makeData(len = 5553) {
    return range(len).map(d => {
        return {
      ...newPerson(),
        children: range(10).map(newPerson)
    };
  });
}

export const Logo = () => (
    <div
        style={{
            margin: "1rem auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center"
        }}
        >
        For more examples, visit {""}
        <br />
        <a href="https://github.com/react-tools/react-table" target="_blank">
            <img
                src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
                style={{ width: `150px`, margin: ".5em auto .3em" }}
                />
        </a>
    </div>
);

export const Tips = () => (
    <div style={{ textAlign: "center" }}>
        <em>Tip: Hold shift when sorting to multi-sort!</em>
    </div>
);
