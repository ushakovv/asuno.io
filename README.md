# asuno-ui

Интерфейс АСУНО для Моссвета

# Сборка

Для сборки пакета необходимо:

1. установить node.js и npm
2. выполнить команду `npm run build`


# Загрузка на тестовый сервер

Открыть в ~/.bash_profile или ~/.profile (в зависимости от OS):
  `nano ~/.bash_profile`

Добавить строки:
  `alias sshdev='ssh asuno@95.215.110.99'`
  `alias fronttodev='scp /путь-к-архиву/dist.tar.gz asuno@95.215.110.99:/tmp/dist.tar.gz'` // пример #путь-к-архиву# => '/Users/your-user-name/Documents/asuno-ui

В своей консоли:
`fronttodev`    - копирует архива на тестовый сервер
`sshdev`        - подключение к ssh тестового сервера

По ssh:
`copynewfront`  - делает бекап, распаковывает архив