
window.onload = function(){

    fetch('http://localhost:3000/getusers')
    .then((response)=>response.json())
    .then((data)=>{
        const tableBody = document.getElementById('crypto-data');

        data.forEach((ticker)=>{
            const row = `

            <tr>

            <td>${ticker.name}</td>
            <td>${ticker.last}</td>
            <td>${ticker.buy}</td>
            <td>${ticker.sell}</td>
            <td>${ticker.volume}</td>
            <td>${ticker.base_unit}</td>

            
            </tr>
            
             
            `
            tableBody.innerHTML += row;
        })
    })
    .catch((error)=> console.log('error fetching data:', error));

}