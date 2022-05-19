const submitReview = (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;

    const emojiSection = document.getElementById('emojiSection');
    const title = document.getElementById('title');
    const outline = document.querySelector(':focus');



    $.ajax({
        type: "POST",
        url: "/server/sentiment_analysis_sentiment_library_function/s-analyzer",
        data: JSON.stringify({ review }), //{ data1: data, data2: decryptCookieIs },
        processData: false, // it prevent jQuery form transforming the data into a query string
        contentType: 'application/json',
        cache: false,
        timeout: 60000,
        success: function({ analysis }) {
            console.log(analysis);
            if (analysis < 0) {
                emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/angry.png">';
                title.style.color = 'red';
                outline.style.borderColor = 'red';
            };
            if (analysis === 0) {
                emojiSection.innerHTML = '<img src="https://img.icons8.com/officel/80/000000/neutral-emoticon.png">';
                title.style.color = '#00367c';
                outline.style.borderColor = '#00367c';
            }
            if (analysis > 0) {
                emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
                title.style.color = 'green';
                outline.style.borderColor = 'green'
            }
        },
        error: function(e) {
            emojiSection.innerHTML = 'There was an error processing your request!'
        }
    });

}

document.getElementById('review').addEventListener('keyup', submitReview);
document.getElementById('reviewForm').addEventListener('submit', submitReview);