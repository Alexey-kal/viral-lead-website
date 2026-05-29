/** Pause off-screen videos to free GPU / decode budget */
export function initMedia() {
  const videos = document.querySelectorAll('.hero-video, .craft-video');
  if (!videos.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    },
    { threshold: [0, 0.2, 0.5] }
  );

  videos.forEach((video) => {
    video.preload = 'metadata';
    video.muted = true;
    observer.observe(video);
  });
}
