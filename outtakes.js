(() => {
  const player = document.getElementById("outtake-player");
  const choices = Array.from(document.querySelectorAll("[data-outtake]"));
  if (!player || !choices.length) return;

  const count = document.getElementById("outtake-count");
  const label = document.getElementById("outtake-label");
  const error = document.getElementById("outtake-error");
  const directLink = document.getElementById("outtake-direct-link");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentIndex = 0;

  const play = () => {
    const attempt = player.play();
    if (attempt) attempt.catch(() => {});
  };

  const selectClip = (index) => {
    currentIndex = index;
    const choice = choices[index];
    choices.forEach((button, buttonIndex) => {
      button.setAttribute("aria-pressed", String(buttonIndex === index));
    });
    player.poster = choice.dataset.poster;
    player.src = choice.dataset.outtake;
    player.setAttribute("aria-label", `Bloopers: ${choice.dataset.label}`);
    label.textContent = choice.dataset.label;
    count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(choices.length).padStart(2, "0")}`;
    directLink.href = choice.dataset.outtake;
    error.hidden = true;
    player.load();
    play();
  };

  choices.forEach((choice, index) => {
    choice.addEventListener("click", () => selectClip(index));
  });

  player.addEventListener("ended", () => {
    if (!reducedMotion.matches) selectClip((currentIndex + 1) % choices.length);
  });

  const showError = () => { error.hidden = false; };
  player.addEventListener("error", showError);
  player.querySelector("source").addEventListener("error", showError);

  if (reducedMotion.matches) {
    player.autoplay = false;
    player.pause();
  }
})();
