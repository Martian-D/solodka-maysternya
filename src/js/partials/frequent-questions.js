import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

new Accordion(".accordion-container");

const faqConteiner= document.querySelector(".accordion-container")




faqConteiner.addEventListener("click", handlerClick)

function handlerClick(event) {
    const trigger= event.target.closest(".ac-trigger")   
    if(!trigger){
    return;
    }
    

    const currentIcon = trigger.querySelector(".ac-icon")
    if(!currentIcon){
        return
    }
    const clearIcons = document.querySelectorAll(".ac-icon")
    clearIcons.forEach((item)=>{
        if(item!==currentIcon){item.classList.remove("onMove")}
        })
        
    currentIcon.classList.toggle("onMove")

}





