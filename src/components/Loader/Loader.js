export default function renderLoader() {
    const wrapper = document.createElement('div');
    wrapper.className = 'loader-overlay';

    const spinner = document.createElement('div');
    spinner.className = 'loader';

    wrapper.appendChild(spinner);
    return wrapper;
}
