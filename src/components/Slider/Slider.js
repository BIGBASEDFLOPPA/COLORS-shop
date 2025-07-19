import './Slider.scss'
import html from './Slider.html?raw'

export default function renderSlider() {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html.trim()

    setTimeout(() => {
        new Swiper('.swiper', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        })
    }, 0)

    return wrapper.firstChild
}
