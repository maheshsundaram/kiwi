const clipboard = () => {
  const curl = document.getElementById("curl");
  navigator.clipboard.writeText(curl.innerText);
  const copy = document.getElementById("copy");
  const text = copy.innerText;
  copy.innerText = text + " ✅";
  setTimeout(() => {
    copy.innerText = text;
  }, 3000);
};

addEventListener("DOMContentLoaded", () => {
  const once = { title: false, desc: false };

  const title = document.getElementById("title");
  const desc = document.getElementById("desc");
  const start = document.getElementById("start");
  const end = document.getElementById("end");

  const offsetBy = (start, hour) => {
    const origin = new Date(start);
    // https://stackoverflow.com/a/66558369/15287885
    const offset = origin.getTime() -
      (origin.getTimezoneOffset() + (60 * hour * -1)) * 60 * 1000;
    const fmt = new Date(offset).toISOString().slice(0, 16);
    return fmt;
  };

  const updateCurl = () => {
    const form = document.querySelector("form");
    const data = new FormData(form);
    const fmt = new URLSearchParams(data).toString();
    const curl = document.getElementById("curl");
    curl.innerHTML = `curl -X POST ${window.location.origin}/event \\<br> 
  &nbsp;&nbsp;-H "Content-Type: application/x-www-form-urlencoded" \\<br>
  &nbsp;&nbsp;-d "${fmt}"`;
  };

  document.querySelectorAll("input[type=text]").forEach((input) => {
    input.addEventListener("keyup", updateCurl);
  });

  document.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("change", updateCurl);
  });

  start.value = offsetBy(new Date(), 0);
  end.value = offsetBy(new Date(), 1);

  title.addEventListener("focus", () => {
    if (!once.title) {
      once.title = true;
      title.value = "";
    }
  });

  title.addEventListener("blur", () => {
    if (title.value === "") {
      title.value = "Meetup";
      once.title = false;
    }
  });

  desc.addEventListener("focus", () => {
    if (!once.desc) {
      once.desc = true;
      desc.value = "";
    }
  });

  desc.addEventListener("blur", () => {
    if (desc.value === "") {
      desc.value = "At the park";
      once.desc = false;
    }
  });

  start.addEventListener("change", () => {
    const offset = offsetBy(start.value, 1);
    end.value = offset;
    updateCurl();
  });

  end.addEventListener("change", () => {
    const s = new Date(start.value);
    const e = new Date(end.value);
    if (!start.value || s > e) start.value = offsetBy(end.value, -1);
    updateCurl();
  });

  updateCurl();
});
