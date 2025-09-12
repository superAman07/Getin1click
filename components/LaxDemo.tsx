"use client";
import { useEffect } from "react";

export default function LaxDemo() {
  useEffect(() => {
    import("lax.js").then((laxModule) => {
      const lax = laxModule.default || laxModule;
      lax.init();
      lax.addDriver("scrollY", () => document.documentElement.scrollTop, { frameStep: 1 });
      lax.addElements(".letter-x", {
        scrollY: {
          translateY: [[-400, 0, 100], [300, 0, 100]],
          scale: [[100, "screenHeight"], [0.25, 10]],
          opacity: [[0, "screenHeight/2", "screenHeight"], [1, 1, 0]],
        },
      });
      lax.addElements(".letter-l", {
        scrollY: {
          translateY: [[-400, 0], [100, 0]],
          translateX: [[0, "screenHeight"], [0, 400]],
          opacity: [[0, "screenHeight/2"], [1, 0]],
        },
      });
      lax.addElements(".letter-a", {
        scrollY: {
          translateY: [[-400, 0], [200, 0]],
          translateX: [[0, "screenHeight"], [0, -400]],
          opacity: [[0, "screenHeight/2"], [1, 0]],
        },
      });
      lax.addElements(".scrolldown", {
        scrollY: {
          "letter-spacing": [[0, "screenHeight"], [0, 150, { cssUnit: "px" }]],
          opacity: [["screenHeight*0.25", "screenHeight*0.75"], [1, 0]],
          translateX: [[0, "screenHeight"], [0, 80]],
        },
      });
      lax.addElements(".oooh", {
        scrollY: {
          translateX: [["elInY", "elOutY"], [0, "screenWidth-200"]],
        },
      });
      lax.addElements(".aaah", {
        scrollY: {
          translateX: [["elInY", "elOutY"], [0, "-screenWidth-200"]],
        },
      });
      lax.addElements(".wheee", {
        scrollY: {
          translateX: [["elInY", "elOutY"], [-400, "screenWidth+100"]],
          skewX: [["elInY", "elOutY"], [40, -40]],
        },
      });
      lax.addElements(".bubble", {
        scrollY: {
          translateY: [["screenHeight/4", "screenHeight * 3"], ["Math.random()*screenHeight", "Math.random()*screenHeight*3"]],
          opacity: [["screenHeight/4", "screenHeight/2"], [0, 1]],
          scale: [[0], ["(Math.random()*0.8)+0.2"]],
          translateX: [[0], ["index*(screenWidth/25)-50"]],
          transform: [[0, 4000], [0, "(Math.random() + 0.8) * 1000", { cssFn: (val: number) => `rotateX(${val % 360}deg)` }]],
          rotate: [[0, 4000], [0, "(Math.random() - 0.5) * 1000"]],
        },
      });
      lax.addElements("#pinkZag", {
        scrollY: {
          translateY: [["elInY", "elOutY"], [0, -300]],
        },
      });
      lax.addElements("#tealZag", {
        scrollY: {
          translateY: [["elInY", "elOutY"], [0, 200]],
        },
      });
      lax.addElements("#purpleZag", {
        scrollY: {
          translateY: [["elInY", "elOutY"], [0, 700]],
        },
      });
      lax.addElements(".downarrows img", {
        scrollY: {
          translateY: [[0, 200], [0, 200]],
          opacity: [[0, "screenHeight"], [1, 0]],
        },
      });
      lax.addElements(".bottombutton", {
        scrollY: {
          "background-position": [["elInY", "elOutY"], [0, 400, { cssFn: (val: number) => `${val}px 0` }]],
          scale: [["elInY", "elCenterY"], [3, 1]],
        },
      });
    });
  }, []);

  return (
    <div className="relative w-full min-h-[480vh] bg-[#242224] text-white font-montserrat overflow-x-hidden">
      <img src="/l.png" className="letter-l fixed left-1/2 mt-[100px] ml-[-75px] w-[200px]" />
      <img src="/a.png" className="letter-a fixed left-1/2 mt-[158px] ml-[-77px] w-[150px]" />
      <div className="letter-x fixed left-1/2 mt-[85px] ml-[-300px] w-[600px] h-[600px] scale-[0.25] origin-center">
        <img src="/x.png" className="absolute w-[600px]" />
      </div>
      <h2 className="scrolldown fixed bottom-[90px] left-[-100vw] w-[300vw] h-[40px] text-[40px] text-center">scroll down</h2>
      <div className="downarrows fixed bottom-[60px] left-1/2 w-[70px] ml-[-35px] h-[26px]">
        <img src="/downarrow.png" className="absolute w-[70px]" />
      </div>
      <div className="zags relative mt-[250vh] z-[100] h-[150vh] overflow-hidden">
        <div id="pinkZag" className="zag absolute w-full h-[150vh] bg-[url('/pink-zag.png')] bg-repeat-x bg-bottom bg-[length:200px]" />
        <div id="tealZag" className="zag absolute w-full h-[150vh] bg-[url('/teal-zag.png')] bg-repeat-x bg-bottom bg-[length:200px]" />
        <div id="purpleZag" className="zag absolute w-full h-[150vh] bg-[url('/purple-zag.png')] bg-repeat-x bg-bottom bg-[length:200px]" />
      </div>
      <div className="bubbles fixed top-[-100vh] z-[5]">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className={`bubble absolute w-[140px] h-[140px] ${["blue", "red", "yellow"][i % 3]}`} />
        ))}
      </div>
      <h1 className="oooh absolute left-0 top-[140vh] text-[150px]">oooh</h1>
      <h1 className="aaah absolute right-0 top-[170vh] text-[150px]">aaah</h1>
      <h1 className="wheee absolute left-0 top-[230vh] h-[50px] text-[100px]">wheee!</h1>
      <div className="bottombg absolute top-[380vh] w-full h-[100vh] bg-[#8d77ed] z-[50]" />
      <a href="https://github.com/alexfoxy/lax.js">
        <div className="bottombutton absolute top-[425vh] left-1/2 ml-[-125px] w-[250px] h-[70px] bg-[url('/button-bg.jpg')] bg-[length:160px] text-white font-extrabold text-center leading-[70px] text-[30px] rounded-[20px] z-[100] cursor-pointer">
          Get lax.js
        </div>
      </a>
      <a href="https://github.com/alexfoxy/lax.js" className="github-corner" aria-label="View source on GitHub">
        {/* SVG omitted for brevity, can be added as a React component if needed */}
      </a>
    </div>
  );
}
