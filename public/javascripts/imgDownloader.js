document.addEventListener('DOMContentLoaded', function(){
    $("input[type='text']").change(function() {
        console.log(this.value);
        $.post('/downloads', {url: this.value}, function (data) {
            console.log('result..',data);
        })
    })
});