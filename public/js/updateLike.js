function updateLike(story_id) {
  document.querySelector(`#like-button-${story_id}`).classList.add('hidden')
  document.querySelector(`#liked-${story_id}`).textContent = "You liked this story"
  $.get("/stories/like/" + story_id, (likes) => {
    likes = JSON.parse(likes)
    document.querySelector(`#likes-count-${story_id}`).textContent = likes.likes + ' People likes this story'
  })
}