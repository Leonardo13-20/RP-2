document.addEventListener("DOMContentLoaded", () => {
  const msm = document.querySelector("#mensaje");
  setTimeout(() => {
    msm.remove();
  }, 2000);
});
