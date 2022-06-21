const deletePost = (btn) => {
    const postId = btn.parentNode.querySelector('[name=postId]').value
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value

    const article = btn.closest('article')

    console.log(postId);
    console.log(csrf);

    fetch('/admin/post/' + postId, {
            method: 'DELETE',
            headers: {
                'csrf-token': csrf
            }
        }).then(result => {
            console.log(result);
            return result.json()
        }).then(data => {
            console.log(data);
            article.remove()
        })
        .catch(err => {
            console.log(err);
        })
}