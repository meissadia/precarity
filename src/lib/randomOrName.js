export const randomOrName = (name) => {
  if (name && name.length > 0)
    return name;

  const rand = array => array[Math.floor(Math.random() * array.length)];
  const names = 'arm can car ear eye fit fur kit leg lit map nit ohm pan pen pin pit ton win wit won zen'.split(' ');
  const number = Math.floor(Math.random() * 100);

  return `${rand(names)}-${number}`;
};
