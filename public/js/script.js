//checks if like button is hidden, then add the like you liked this story
document.addEventListener('DOMContentLoaded', () => {
    const like = document.querySelectorAll('.like-button');
    const liked = document.querySelectorAll('.liked')
    for (let i = 0; i < like.length; i++) {
        if (like[i].classList.contains('hidden')) {
            liked[i].textContent = "You liked this story"
        }
    }

})