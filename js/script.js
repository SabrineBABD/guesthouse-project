
function signup(role) {
    let firstName = document.getElementById("firstName").value;
    let verifFirstName = firstName.length >= 3;
    DisplayError( verifFirstName,"errFirstName","First Name should be at least 3 char" );
  
    let lastName = document.getElementById("lastName").value;
    let verifLastName = lastName.length >= 3;
    DisplayError(verifLastName, "errLastName", "Last Name be at least 5 char");
  
    let tel = document.getElementById("tel").value;
    let verifTel = tel.length == 8 && !isNaN(tel);
    DisplayError(verifTel, "errTel", "tel invalid");
  
    let email = document.getElementById("email").value;
    let verifEmail = validateEmail(email);
    DisplayError(verifEmail, "errEmail", "email invalid");
  
    let verifExistEmail = existEmail(email);
    DisplayError(!verifExistEmail, "erreurEmail", "email Existe");
  
    let password = document.getElementById("password").value;
    let verifPwd = password.length > 5;
    DisplayError(verifPwd, "errPwd", "Pwd invalid");
  
    let cPassword = document.getElementById("cpassword").value;
    let verifCPwd = mustMatch(password, cPassword);
    DisplayError(verifCPwd, "errCPwd", "cPwd not match ");

    let Statut=verifStatut(role)

  
    if (
      verifFirstName &&
      verifLastName &&
      verifTel &&
      verifEmail &&
      verifPwd &&
      verifCPwd &&
      !verifExistEmail
     
      ) {
      let usersTab = getFromLS("users");
      let data = {
        id: generateId(usersTab),
        firstName: firstName,
        lastName: lastName,
        tel: tel,
        email: email,
        password: password,
        role: role,
        statut:Statut
      };
      usersTab.push(data);
      localStorage.setItem("users", JSON.stringify(usersTab));
      location.replace("login.html");
    }
  }
  
  function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let users = getFromLS("users");
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password ) {
        localStorage.setItem("connectedUser", JSON.stringify(users[i].id));
        if (users[i].role === "admin") {
          location.replace("tableowners.html");
        } else if (users[i].role === "owner") {
          if(users[i].statut===true){
          location.replace("addhouse.html");
          }else{
            document.getElementById("errLogin").innerHTML = "Your status is false , you can't connect until the approuvement of Admin";
            document.getElementById("errLogin").style.color = "red";
          }
        } else if (users[i].role === "client"){
          location.replace("houses.html");
        }
        break;
      }
       else {
        document.getElementById("errLogin").innerHTML = "Not OK";
        document.getElementById("errLogin").style.color = "red";
      }
    }
  }


  

  function tableOwners(){
  let innerOwner = ``;
  let users=getFromLS("users")
  for (let i = 0; i < users.length; i++) {
    if (users[i].role==="owner") {
       
       
        innerOwner=
        innerOwner + 
        ` 
        <tr>
           <th >${users[i].id}</th>
           <td>${users[i].firstName}</td>
           <td>${users[i].lastName}  </td>
           <td>${users[i].tel} </td>
           <td>${users[i].email} </td>
           <td>
          <button class="btn ${users[i].statut ? "btn-danger":"btn-success" }" onclick= " ownerAddition(${users[i].id})" >${users[i].statut ? "Desactivate":"Activate"}</button>
          <div>  ${users[i].statut ? "The owner is activate" : "The owner is desactivate" } </div>
           </td>
           
        </tr>
     `;
     }
   
     
    }

    document.getElementById("table-Owner").innerHTML = innerOwner;    
}


function ownerAddition(id){
users=getFromLS("users")
users[id].statut=!users[id].statut
localStorage.setItem("users", JSON.stringify(users));

}

 

// function downloadPictures () {
//   document.getElementById('upload-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Empêche le formulaire de se soumettre normalement
  
//     const formData = new FormData(this); // Récupère les données du formulaire
//     const photoFile = formData.get('photo');
  
//     if (photoFile.type.includes('image')) {
//       const reader = new FileReader();
  
//       reader.onload = function() {
//         const img = document.createElement('img');
//         img.src = reader.result;
//         document.body.appendChild(img);
//       };
  
//       reader.readAsDataURL(photoFile);
//     } else {
//       alert('Veuillez sélectionner une image.');
//     }
//   });
   
// }

// downloadPictures ()

function inputAddHouseControl(name,town,address,description) {
  let verifHouseName = name.length >= 3;
  DisplayError( verifHouseName,"errNamehouse","House Name should be at least 3 char" );
  
  let verifTown = town.length >= 3;
  DisplayError( verifTown,"errTown"," Town should be at least 3 char" );

  let verifAddress = address.length >= 10;
  DisplayError( verifAddress,"errAdress"," Town should be at least 10 char" );

  let verifDescription = description.length >= 10;
  DisplayError( verifDescription,"errDesc"," Town should be at least 10 char" );
  if(verifHouseName  && verifTown && verifAddress && verifDescription  ){ 
    return true
  }
}

function addHouse() {
  let name = document.getElementById("housename").value;
  let address = document.getElementById("address").value;
  let town = document.getElementById("town").value;
  let description = document.getElementById("description").value;
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let houses = getFromLS("houses");
if(inputAddHouseControl(name,town,address,description)){
  let data = {
    id: generateId(houses),
    idOwner:connectedUser ,
    name:name,
    address:address,
    town: town,
    description: description,
  };

  houses.push(data);
  localStorage.setItem("houses", JSON.stringify(houses));

  location.replace("tablehouses.html");
}
}

function inputAddRoomControl(name,price,capacity,description) {

  let verifRoomName = name.length >= 2;
  DisplayError( verifRoomName,"errNameroom","Room Name should be at least 2 char" );

  let verifPrice = price.length >= 2;
  DisplayError( verifPrice,"errPrice","Price should be at least 2 char" );

  let verifCapacity = capacity <= 4 && capacity >0 ;
  DisplayError( verifCapacity,"errCapacity","Capacity should be at most 4 and at least 1" );

  let verifDescription = description.length >= 10;
  DisplayError( verifDescription,"errDesc"," Town should be at least 10 char" );

  if(verifRoomName  && verifPrice && verifCapacity  && verifDescription  ){ 
    return true
  }
}

function addRoom () {
  let name = document.getElementById("roomname").value;
  let price = document.getElementById("price").value;
  let capacity = document.getElementById("capacity").value;
  let description = document.getElementById("description").value;
  let idHouse= document.getElementById("selectHouse").value;
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let rooms = getFromLS("rooms");
  let houses = getFromLS("houses");
  if(inputAddRoomControl(name,price,capacity,description)){
  let data = {
    id: generateId(rooms),
    idOwner:connectedUser ,
    idHouse:Number(idHouse),
    name:name,
    price:price,
    capacity: capacity,
    description: description,
  };

  rooms.push(data);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  
}
}
function somme(idHouse) {
  let rooms=getFromLS("rooms")
  let s=0;
  for (let index = 0; index < rooms.length; index++) {
   if (rooms[index].idHouse===idHouse) {
     s=s+1
   }
   
  }return s
  
}

function displayOptionTotableRooms() {
let houses=getFromLS("houses")
let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
let innerSelect=`<option value="">-- Select House --</option>`
for (let i = 0; i < houses.length; i++){
 if (houses[i].idOwner===connectedUser) {
  innerSelect =innerSelect +`
  <option value="${houses[i].id}">${houses[i].name} </option>
   `
 }else{
  innerSelect =innerSelect +`
  <option value="${houses[i].id}">${houses[i].name} </option>
   `
 }
  
}
  
 document.getElementById('selectHouse').innerHTML=innerSelect 
}

function displayRoomsReferToHouse(){
  let rooms=getFromLS("rooms")
  let idHouse= document.getElementById("selectHouse").value;
    let filtredRooms=[]
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].idHouse==idHouse) {
        filtredRooms.push(rooms[i])
      }
    }
    displayRoomsAfterSelect(filtredRooms)
  } 

  function displayRoomsAfterSelect(data) {
    let rooms = data === undefined ? getFromLS("rooms") : data 
    let innerRoom = ``;
    for (let i = 0; i < rooms.length; i++) {
      innerRoom =
        innerRoom +`
        <tr>
           <th >${rooms[i].id}</th>
           <td>${rooms[i].name}  </td>
           <td>${rooms[i].capacity}</td>
           <td>${rooms[i].price}  </td>
           <td>${rooms[i].description} </td>
           <td>
          <button type="button"  class="btn btn-outline-danger" data-toggle="modal" data-target="#myModal" onclick="reserveRoom(${rooms[i].id},'${rooms[i].name}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
         </td>
         <td>
         <button type="button" class="btn btn-outline-info" onclick="navigateTo(${rooms[i].id} , 'editRoom.html')" ><i class="fa fa-pencil" aria-hidden="true"></i></button>
         </td>
        </tr>
     `;
     }


    document.getElementById("table-Room").innerHTML = innerRoom;    
}

    function displayRooms() {
     let rooms=getFromLS("rooms");
     let idHouse= getFromLS("idHouse")
     let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
     let user=getFromLSByKeyAndId("users",connectedUser)
     let innerRoom = ``;
      for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].idHouse===idHouse) {
        if (user.role==="owner") {
          if(rooms[i].idOwner===connectedUser){
        
            innerRoom =
          innerRoom +
          ` 
          <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
          <a href="#" class="room">
            <figure class="img-wrap">
              <img src="images/img_3.jpg" alt="Free website template" class="img-fluid mb-3">
            </figure>
            <div class="p-3 text-center room-info">
            <h2>${rooms[i].name}</h2>
            <span class="text-uppercase ">${rooms[i].price}/${rooms[i].capacity} </span>
            <h6 > Description: ${rooms[i].description}</h6>
          </div>
          </a>
        </div>
    
      `; 
          } 
        }else if (user.role==="client"){
          innerRoom =
          innerRoom +
          ` 
          <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
          <a href="#" class="room" onclick="goToRoomReseravation(${rooms[i].id})">
            <figure class="img-wrap">
              <img src="images/img_3.jpg" alt="Free website template" class="img-fluid mb-3">
            </figure>
            <div class="p-3 text-center room-info">
            <h2>${rooms[i].name}</h2>
            <span class="text-uppercase ">${rooms[i].price}/${rooms[i].capacity} </span>
            <h6 > Description: ${rooms[i].description}</h6>
          </div>
          </a>
        </div>
    
      `;
          
        }else{
          innerRoom =
          innerRoom +
          ` 
          <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
          <a href="#" class="room">
            <figure class="img-wrap">
              <img src="images/img_3.jpg" alt="Free website template" class="img-fluid mb-3">
            </figure>
            <div class="p-3 text-center room-info">
            <h2>${rooms[i].name}</h2>
            <span class="text-uppercase ">${rooms[i].price}/${rooms[i].capacity} </span>
            <h6 > Description: ${rooms[i].description}</h6>
          </div>
          </a>
        </div>
    
      `;

        }
      }  
        }
      document.getElementById("display-room").innerHTML = innerRoom;
    }




  function displayAllRooms(data) {
    let rooms = data === undefined ? getFromLS("rooms") : data 
    let innerRoom = ``;
    for (let i = 0; i < rooms.length; i++) {
      innerRoom =
        innerRoom +
        `  
        <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
        <a href="#" class="room">
          <figure class="img-wrap">
            <img src="images/img_3.jpg" alt="Free website template" class="img-fluid mb-3">
          </figure>
          <div class="p-3 text-center room-info">
          <h2>${rooms[i].name}</h2>
          <span class="text-uppercase ">${rooms[i].price}/${rooms[i].capacity} </span>
          <h6 > Description: ${rooms[i].description}</h6>
        </div>
        </a>
      </div>
  
    `; 
        } 
      
    document.getElementById("display-room").innerHTML = innerRoom;
  }     
  
function displayOption() {
let houses=getFromLS("houses")
let rooms=getFromLS("rooms")
let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
let innerSelect=`<option value="">-- Select House --</option>`
for (let i = 0; i < houses.length; i++){
 if (houses[i].idOwner===connectedUser) {
  let numberrooms=somme(houses[i].id)
  if(numberrooms < 5){
  innerSelect =innerSelect +`
  <option value="${houses[i].id}">${houses[i].name} </option>
   `
}
 }
  
}
  
 document.getElementById('selectHouse').innerHTML=innerSelect 
}


function  tableUsers(){
  let innerUser = ``;
  let users=getFromLS("users")
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  for (let i = 0; i < users.length; i++) {
   
       
       
        innerUser=
        innerUser + 
        ` 
        <tr>
           <th >${users[i].id}</th>
           <td>${users[i].firstName}  </td>
           <td>${users[i].lastName}</td>
           <td>${users[i].email}  </td>
           <td>${users[i].tel} </td>
           <td>${users[i].role} </td>
           <td>
           <button type="button"  class="btn btn-outline-danger" data-toggle="modal" data-target="#myModal" onclick="reserve(${users[i].id},'${users[i].firstName}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
         </td> 
        </tr>
     `;
    }

    document.getElementById("table-User").innerHTML = innerUser;    
}






function  tableHouses(){
  let innerHouse = ``;
  let houses=getFromLS("houses");
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let user=getFromLSByKeyAndId("users",connectedUser)
  for (let i = 0; i < houses.length; i++) {
    if(user.role==="owner"){
      if (houses[i].idOwner===connectedUser) {
       
       
        innerHouse=
        innerHouse + 
        ` 
        <tr>
           <th >${houses[i].id}</th>
           <td>${houses[i].name}  </td>
           <td>${houses[i].address}</td>
           <td>${houses[i].town}  </td>
           <td>${houses[i].description} </td>
           <td>
           <button type="button"  class="btn btn-outline-danger" data-toggle="modal" data-target="#myModal" onclick="reserveHouse(${houses[i].id},'${houses[i].name}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
         </td>
         <td>
         <button type="button" class="btn btn-outline-info" onclick="navigateTo(${houses[i].id} , 'editHouse.html')" ><i class="fa fa-pencil" aria-hidden="true"></i></button>
         </td>
        </tr>
     `;
       }
    }else{
       
      innerHouse=
      innerHouse + 
      ` 
      <tr>
         <th >${houses[i].id}</th>
         <td>${houses[i].name}  </td>
         <td>${houses[i].address}</td>
         <td>${houses[i].town}  </td>
         <td>${houses[i].description} </td>
         <td>
         <button type="button"  class="btn btn-outline-danger" data-toggle="modal" data-target="#myModal" onclick="reserveHouse(${houses[i].id},'${houses[i].name}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
       </td>
       <td>
       <button type="button" class="btn btn-outline-info" onclick="navigateTo(${houses[i].id} , 'editHouse.html')" ><i class="fa fa-pencil" aria-hidden="true"></i></button>
       </td>
      </tr>
   `;

     }
     

     
    }

    document.getElementById("table-House").innerHTML = innerHouse;    
}
function book(idHouse){
  localStorage.setItem("reserve",JSON.stringify(idHouse))
  location.replace("rooms.html")
  localStorage.setItem("idHouse",JSON.stringify(idHouse))
}
function goToRoomReseravation(id) {
  localStorage.setItem("reserve",JSON.stringify(id))
  location.replace("reservation.html")
}



function validateDates(checkInDate,checkOutDate) {
  if (new Date(checkInDate) >= new Date(checkOutDate)) {
      alert("Check-out date must be later than check-in date.");
      checkOutDate.value = "";
      return false
  }
  return true
}

function inputReservationControl(name,phone,email) {
let verifName = name.length >= 3;
DisplayError( verifName,"errName","Name should be at least 3 char" );

let verifTel = phone.length == 8 && !isNaN(phone);
DisplayError(verifTel, "errTel", "tel invalid");

let verifEmail = validateEmail(email);
DisplayError(verifEmail, "errEmail", "email invalid");

let verifExistEmail = existEmail(email);
DisplayError(!verifExistEmail, "erreurEmail", "email Existe");
if(verifName && verifTel && verifEmail ){ 
  return true
}
}


function isRoomAvailable(roomId, checkInDate, checkOutDate) {
  let reservation = getFromLS("reservation");
  let s=true
  if ((checkInDate==="")||(checkOutDate==="")) {
    s=false
    alert(" Date is empty")
    return s
  }else{
  
  for (let i = 0; i < reservation.length; i++){ 
    if (reservation[i].idroom==roomId) {
      if ((new Date(checkInDate) >=new Date( reservation[i].checkin) && new Date(checkInDate) < new Date(reservation[i].checkout))) {
       s=false; // Room is booked during the check-in date
       document.getElementById("msgcheckin").innerHTML = "Room isn't available";
        document.getElementById("msgcheckin").style.color = "red";
        document.getElementById("msgcheckout").innerHTML = "";
        break
      }
      else if ((new Date(checkOutDate) > new Date(reservation[i].checkin) && new Date(checkOutDate) <= new Date(reservation[i].checkout)) || (new Date(checkInDate) <= new Date( reservation[i].checkin) && new Date(checkOutDate) > new Date(reservation[i].checkout))) {
          s=false; // Room is booked during the check-out date
          document.getElementById("msgcheckout").innerHTML = "Room isn't available";
          document.getElementById("msgcheckout").style.color = "red";
          document.getElementById("msgcheckin").innerHTML = "";
          break
      }
      else{
         // Room is available for the given date range  
         s=true ; 
         document.getElementById("msgcheckout","msgcheckin").innerHTML = "Room is available";
        document.getElementById("msgcheckout","msgcheckin").style.color = "green";
     }
    }
} 
  }

return s 

}

function capacity(a,b,i) {
  let rooms = getFromLS("rooms") 
if(Number(a)+Number(b)>rooms[i].capacity){
  alert("Check-out places number");
return false

}else{
  return true
}
  
}


function bookRoom(){
  let name = document.getElementById("name").value;
  let phone= document.getElementById("tel").value;
  let email = document.getElementById("email").value;
  let checkin = document.getElementById("checkin_date").value;
  let checkout= document.getElementById("checkout_date").value;
  let adults= document.getElementById("adultsselect").value;
  let children= document.getElementById("childrenselect").value;
  let note= document.getElementById("message").value;
  let idHouse= JSON.parse(localStorage.getItem("idHouse"));
  let reserve = JSON.parse(localStorage.getItem("reserve"));
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let reservation = getFromLS("reservation") ;
  if (  validateDates(checkin,checkout) && isRoomAvailable(reserve,checkin,checkout) && capacity(adults,children,reserve)&& inputReservationControl(name,phone,email)) {
  let data = {
    id: generateId(reservation),
    idUser:connectedUser ,
    idHouse:idHouse,
    idroom:reserve,
    name:name,
    phone:phone,
    email:email,
    checkin:checkin,
    checkout:checkout,
    adults:adults,
    children:children,
    note:note,
  };
 

  reservation.push(data);
  localStorage.setItem("reservation", JSON.stringify(reservation));
  }
}



function  displayHouse() {
  let houses = getFromLS("houses") 
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let user=getFromLSByKeyAndId("users",connectedUser)
  let innerHouse = ``;
  for (let i = 0; i < houses.length; i++) {
    if (user.role==="owner") {
      if (houses[i].idOwner===connectedUser) {
        innerHouse =
      innerHouse +
      ` 
      <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
            <a href="#" class="house" onclick="book(${houses[i].id})")>
              <figure class="img-wrap">
                <img src="images/m1.jpg" alt="Free website template" class="img-fluid mb-3">
              </figure>
              <div class="p-3 text-center house-info">
                <h2>${houses[i].name}</h2>
                <span class="text-uppercase ">${houses[i].address}/${houses[i].town} </span>
                <h6 > Description: ${houses[i].description}</h6>
              </div>
            </a>
          </div>
  `; 
      }
      
    }else{
    innerHouse =
      innerHouse +
      ` 
      <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
      <a href="#"class="house" onclick="book(${houses[i].id})"  >
        <figure class="img-wrap">
          <img src="images/m1.jpg" alt="Free website template" class="img-fluid mb-3">
        </figure>
        <div class="p-3 text-center house-info">
          <h2>${houses[i].name}</h2>
          <span class="text-uppercase ">${houses[i].address}/${houses[i].town} </span>
          <h6 > Description: ${houses[i].description}</h6>
        </div>
      </a>
    </div>

  `;
    }
  }
  document.getElementById("display-house").innerHTML = innerHouse;
}
 
function displayHouseToEdit() {
  let houseId = getFromLS("reserve");
  let house = getFromLSByKeyAndId("houses", houseId);
  document.getElementById("housename").value=house.name;
  document.getElementById("address").value=house.address;
  document.getElementById("town").value=house.town;
  document.getElementById("description").value=house.description;

}

function editHouse() {

  let name = document.getElementById("housename").value;
  let address = document.getElementById("address").value;
  let town = document.getElementById("town").value;
  let description = document.getElementById("description").value;
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let idHouse = JSON.parse(localStorage.getItem("reserve"));
  let houses = getFromLS("houses");

  let data = {
    id:idHouse,
    idOwner:connectedUser ,
    name:name,
    address:address,
    town: town,
    description: description,
  };
  let x ;
  for (let i = 0; i < houses.length; i++) {
    if (houses[i].id === idHouse) {
      x = i;
    }
  }
  houses.splice(x, 1, data);
  localStorage.setItem("houses", JSON.stringify(houses));
  location.replace("tablehouses.html");
}

function deleteHouse() {
  let idHouse = JSON.parse(localStorage.getItem('idHouse'))
  let houses = getFromLS("houses");
  let pos;
  for (let i = 0; i <houses.length; i++) {
    if (houses[i].id === idHouse) {
      pos = i;
    }
  }

 houses.splice(pos, 1);
  localStorage.setItem("houses", JSON.stringify(houses));
  localStorage.removeItem(`idHouse`)
  location.reload();
}

function reserve(id,hName){
  localStorage.setItem("idUser",JSON.stringify(id))
  document.getElementById("modal-body").innerHTML=" Are you sure to delete "+hName
}

function deleteUser() {
  let idUser = JSON.parse(localStorage.getItem('idUser'))
  let users = getFromLS("users");
  let pos;
  for (let i = 0; i <users.length; i++) {
    if (users[i].id === idUser) {
      pos = i;
    }
  }

 users.splice(pos, 1);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem(`idUser`)
  location.reload();
}




function reserveHouse(id,hName){
  localStorage.setItem("idHouse",JSON.stringify(id))
  document.getElementById("modal-body").innerHTML=" Are you sure to delete "+hName
}

function  tableRooms(){
  let innerRoom = ``;
  let rooms=getFromLS("rooms")
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let user=getFromLSByKeyAndId("users",connectedUser)
  for (let i = 0; i <rooms.length; i++) {
    if(user.role==="owner"){
        if (rooms[i].idOwner===connectedUser ) {
       
       
        innerRoom=
        innerRoom + 
        ` 
        <tr>
           <th >${rooms[i].id}</th>
           <td>${rooms[i].name}  </td>
           <td>${rooms[i].capacity}</td>
           <td>${rooms[i].price}  </td>
           <td>${rooms[i].description} </td>
           <td>
          <button type="button"  class="btn btn-outline-danger" data-toggle="modal" data-target="#myModal" onclick="reserveRoom(${rooms[i].id},'${rooms[i].name}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
         </td>
         <td>
         <button type="button" class="btn btn-outline-info" onclick="navigateTo(${rooms[i].id} , 'editRoom.html')" ><i class="fa fa-pencil" aria-hidden="true"></i></button>
         </td>
        </tr>
     `;
        } 
    }else{
      innerRoom=
      innerRoom + 
      ` 
      <tr>
         <th >${rooms[i].id}</th>
         <td>${rooms[i].name}  </td>
         <td>${rooms[i].capacity}</td>
         <td>${rooms[i].price}  </td>
         <td>${rooms[i].description} </td>
         <td>
        <button type="button"  class="btn btn-outline-danger" data-toggle="modal" data-target="#myModal" onclick="reserveRoom(${rooms[i].id},'${rooms[i].name}')"   data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa fa-trash" aria-hidden="true"></i></button>
       </td>
       <td>
       <button type="button" class="btn btn-outline-info" onclick="navigateTo(${rooms[i].id} , 'editRoom.html')" ><i class="fa fa-pencil" aria-hidden="true"></i></button>
       </td>
      </tr>
   `;
     }
    }

    document.getElementById("table-Room").innerHTML = innerRoom;    
}

function displayRoomToEdit() {
  let roomId = getFromLS("reserve");
  let room = getFromLSByKeyAndId("rooms", roomId);
  document.getElementById("roomname").value=room.name;
  document.getElementById("price").value=room.price;
  document.getElementById("capacity").value=room.capacity;
  document.getElementById("description").value=room.description;

}

function editRoom() {

  let name = document.getElementById("roomname").value;
  let price = document.getElementById("price").value;
  let capacity = document.getElementById("capacity").value;
  let description = document.getElementById("description").value;
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let idHouse= document.getElementById("selectHouse").value;
  let idRoom = JSON.parse(localStorage.getItem("reserve"));
  let rooms = getFromLS("rooms");

  let data = {
    id:idRoom,
    idOwner:connectedUser ,
    idHouse:Number(idHouse),
    name:name,
    price:price,
    capacity: capacity,
    description: description,
  };
  let x ;
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].id === idRoom) {
      x = i;
    }
  }
  rooms.splice(x, 1, data);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  location.replace("tablerooms.html");
}

function deleteRoom() {
  let idRoom = JSON.parse(localStorage.getItem('idRoom'))
  let rooms = getFromLS("rooms");
  let pos;
  for (let i = 0; i <rooms.length; i++) {
    if (rooms[i].id === idRoom) {
      pos = i;
    }
  }

 rooms.splice(pos, 1);
  localStorage.setItem("rooms", JSON.stringify(rooms));
  localStorage.removeItem(`idRoom`)
  location.reload();
}

function reserveRoom(id,hName){
  localStorage.setItem("idRoom",JSON.stringify(id))
  document.getElementById("modal-body").innerHTML=" Are you sure to delete "+hName
}


//   ******** Génerique Functions Start******//

function verifStatut(role){
    if (role==="owner") {
        Statut=false    
    }
    else{
        Statut=true

    }
    return Statut
}



function DisplayError(verif, id, msgErr) {
    if (verif) {
      document.getElementById(id).innerHTML = "";
    } else {
      document.getElementById(id).innerHTML = msgErr;
    }
  }
  
  function validateEmail(email) {
    const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return re.test(email);
  }
  
  function existEmail(email) {
    let existEmail = false;
    let users = getFromLS("users");
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        existEmail = true;
        break;
      }
    }
  
    return existEmail;
  }
  
  function mustMatch(a, b) {
    return a === b;
  }
  
  function getFromLS(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  
  function navigateTo(id, path) {
    localStorage.setItem("reserve", JSON.stringify(id));
    location.replace(path);
  }
  
  function generateId(T) {
    if (T.length === 0) {
      return 0;
    } else {
      let max = T[0].id;
      for (let i = 0; i < T.length; i++) {
        if (T[i].id > max) {
          max = T[i].id;
        }
      }
      return max + 1;
    }
  }
  
  function getFromLSByKeyAndId(key, id) {
    let T = getFromLS(key);
    for (let i = 0; i < T.length; i++) {
      if (T[i].id === id) {
        return T[i];
      }
    }
  }
  

  
  // ******** Génerique Functions End******//
  
  function initializeCalendar() {
  document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Initial view of the calendar
        editable: true, // Allow event drag-and-drop
        selectable: true, // Allow selecting dates
        events:generateEvents() ,
       
        eventClick: function (info) {
            // Handle event click
            // alert('Event: ' + info.event.title);
            const eventId = info.event.id; // Get the unique event ID
            const eventTitle = info.event.title; // Get the event title
            // JavaScript template literal to create a confirmation message
            if (confirm(`Delete event "${eventTitle}"?`)) {
              deleteReservation(Number(info.event.id))
                // Remove the event from the calendar
                
                calendar.getEventById(eventId).remove();}
        },
        select: function (info) {
            // Handle date selection
            console.log(info.event.id);
            const title = prompt('Event Title:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: info.startStr,
                    end: info.endStr,
                    allDay: info.allDay
                });
            }
            calendar.unselect();
        }
    });
    calendar.render();
});
  }



function deleteReservation(id) {
  let reservation = getFromLS("reservation");
  let pos;
  for (let i = 0; i <reservation.length; i++) {
    if (reservation[i].id ===id ) {
      pos = i;
    }
  }

 reservation.splice(pos, 1);
  localStorage.setItem("reservation", JSON.stringify(reservation));
  location.reload();
}



  function generateEvents() {
    reservation=getFromLS("reservation")
    houses=getFromLS("houses")
    rooms=getFromLS("rooms")
    let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
    let user=getFromLSByKeyAndId("users",connectedUser)
      const events = [];
      for (let i = 0; i < reservation.length; i++) {
        if(user.role==="owner"){
          if(houses[reservation[i].idHouse].idOwner===connectedUser){
       const start=new Date((convertDateToCustomFormat(reservation[i].checkin)));
        const end=new Date((convertDateToCustomFormat(reservation[i].checkout)));
          const event = {
              id: reservation[i].id,
              title: `H:${houses[reservation[i].idHouse].name}/R:${rooms[reservation[i].idroom].name}/Reserved by ${reservation[i].name}`,
              start:start.setHours(10),
              end:end.setHours(10),
          };
          events.push(event);
        }
      }else if(user.role==="client"){
        if(reservation[i].idUser===connectedUser){
          const start=new Date((convertDateToCustomFormat(reservation[i].checkin)));
          const end=new Date((convertDateToCustomFormat(reservation[i].checkout)));
            const event = {
                id: reservation[i].id,
                title: `H:${houses[reservation[i].idHouse].name}/R:${rooms[reservation[i].idroom].name}/Reserved by ${reservation[i].name}`,
                start:start.setHours(10),
                end:end.setHours(10),
            };
            events.push(event);
          }
     
    } else{
      const start=new Date((convertDateToCustomFormat(reservation[i].checkin)));
        const end=new Date((convertDateToCustomFormat(reservation[i].checkout)));
          const event = {
              id: reservation[i].id,
              title: `H:${houses[reservation[i].idHouse].name}/R:${rooms[reservation[i].idroom].name}/Reserved by ${reservation[i].name}`,
              start:start.setHours(10),
              end:end.setHours(10),
          };
          events.push(event);
      }
   
   
  }
  return events;
}
  
 

  function convertDateToCustomFormat(dateString) {
    const parts = dateString.split(' ');
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthName = parts[1].slice(0, parts[1].length - 1);
        const year = parseInt(parts[2]);

        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];

        const month = monthNames.indexOf(monthName);

        if (month !== -1) {
            const formattedDate = `${year}, ${month + 1}, ${day}`;
            return formattedDate;
        }
    }

    return 'Invalid Date';
}




function searchHouse() {
  let innerHouse = ``;
  let search = document.getElementById("search").value;
  let houses = getFromLS("houses");
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  let user=getFromLSByKeyAndId("users",connectedUser)
  for (let i = 0; i <houses.length; i++) {
    if(user.role==="owner"){
      if (houses[i].idOwner===connectedUser){
      if (houses[i].name.toLowerCase().includes(search.toLowerCase()) || houses[i].address.includes(search)) {
        innerHouse =
          innerHouse +
          ` 
           <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
          <a href="#" class="house" )>
            <figure class="img-wrap">
              <img src="images/m1.jpg" alt="Free website template" class="img-fluid mb-3">
            </figure>
            <div class="p-3 text-center house-info">
              <h2>${houses[i].name}</h2>
              <span class="text-uppercase ">${houses[i].address}/${houses[i].town} </span>
              <h6 > Description: ${houses[i].description}</h6>
            </div>
            </a>
        </div>
        
  
    `;
      }
    }
  }else{
    if (houses[i].name.toLowerCase().includes(search.toLowerCase()) || houses[i].address.includes(search)) {
      innerHouse =
        innerHouse +
        ` 
         <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
        <a href="#" class="house" )>
          <figure class="img-wrap">
            <img src="images/m1.jpg" alt="Free website template" class="img-fluid mb-3">
          </figure>
          <div class="p-3 text-center house-info">
            <h2>${houses[i].name}</h2>
            <span class="text-uppercase ">${houses[i].address}/${houses[i].town} </span>
            <h6 > Description: ${houses[i].description}</h6>
          </div>
          </a>
      </div>
      

  `;
    }
  }
  }
  document.getElementById("display-house").innerHTML = innerHouse;
}

function logout() {
  localStorage.removeItem("connectedUser");
  location.replace("index.html");
}



function displayHeader() {
  let innerHeader = ``;
  let connectedUser = JSON.parse(localStorage.getItem("connectedUser"));
  if (connectedUser !== null) {
    // here into connected user
    let user = getFromLSByKeyAndId("users", connectedUser);
    if (user.role === "admin") {
      // here into connected user role admin

      innerHeader = `     
      
        <nav role="navigation">
        <div class="container">
          <div class="row full-height align-items-center">
            <div class="col-md-6 mx-auto">
              <ul class="list-unstyled menu">
                <li><a href="houses.html">Houses</a></li>
                <li><a href="rooms.html">Rooms</a></li>
                <li><a href="calendarreservation.html">Calendar reservation</a></li>
                <li><a href="tableusers.html">Table users</a></li>
                <li><a href="tableowners.html">Table owners</a></li>
                <li><a href="tablehouses.html">Table houses</a></li>
                <li><a href="tablerooms.html">Tablerooms</a></li>
                <li><a onclick="logout()">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        </nav>
       
      `;
    } else if(user.role ==="owner") {
      // here into connected user role simple owner
      innerHeader = `  
      
      <nav role="navigation">
        <div class="container">
          <div class="row full-height align-items-center">
            <div class="col-md-6 mx-auto">
              <ul class="list-unstyled menu">
                <li><a href="houses.html">Houses</a></li>
                <li><a href="rooms.html">Rooms</a></li>
                <li><a href="calendarreservation.html">Calendar reservation</a></li>
                <li><a href="addhouse.html">Add houses</a></li>
                <li><a href="addroom.html">Add rooms</a></li>
                <li><a href="tablehouses.html">Table houses</a></li>
                <li><a href="tablerooms.html">Tablerooms</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a onclick="logout()">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        </nav>
      `;
   
  } else if(user.role === "client") {
     // here into connected user role client
    innerHeader = `     
 
        <nav role="navigation">
      <div class="container">
        <div class="row full-height align-items-center">
          <div class="col-md-6 mx-auto">
            <ul class="list-unstyled menu">
              <li><a href="houses.html">Houses</a></li>
              <li><a href="rooms.html">Rooms</a></li>
              <li><a href="calendarreservation.html">Calendar reservation</a></li>
              <li><a href="reservation.html">Reservation</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a onclick="logout()">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
      </nav>
     
    `;
 }
}
 else{
  innerHeader= `     

        <nav role="navigation">
                <div class="container">
                  <div class="row full-height align-items-center">
                    <div class="col-md-6 mx-auto">
                      <ul class="list-unstyled menu">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="login.html">login</a></li>
                        <li><a href="signup-admin.html">Signup admin</a></li>
                        <li><a href="signup-client.html">Signup client</a></li>
                        <li><a href="signup-owner.html">Signup owner</a></li>
                        <li><a href="about.html">About</a></li>
                        <li><a href="events.html">Events</a></li>
                        <li><a href="contact.html">Contact</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                </nav>
               
    `;

  }

  document.getElementById("header").innerHTML = innerHeader;
}