const searchInput = document.getElementById('search‑input');
const menuList = document.getElementById('menu‑list');
const noTip = document.getElementById('no‑tip');
const liItems = menuList.querySelectorAll('li');

//监听输入框输入事件，实时过滤
searchInput.addEventListener('input', function(){
    const keyword = this.value.trim().toLowerCase();
    let matchCount = 0;

    liItems.forEach(item=>{
        const text = item.textContent.toLowerCase();
        if(text.includes(keyword)){
            item.style.display = 'block';
            matchCount++;
        }else{
            item.style.display = 'none';
        }
    })

    //没有匹配项，显示提示
    if(matchCount === 0){
        noTip.style.display = 'block';
    }else{
        noTip.style.display = 'none';
    }
})
