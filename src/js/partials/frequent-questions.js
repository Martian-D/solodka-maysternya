import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

new Accordion(".accordion-container");

const faqConteiner= document.querySelector(".accordion-container", {
    
})

faqConteiner.addEventListener("click", handlerClick)

function handlerClick(event) {
   console.log(event);
   if(!event.target.classList.contains("ac-trigger")){
    return;
    }
    console.log("ok")
}




