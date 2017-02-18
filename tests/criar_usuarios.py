import requests
import json

qtd = int(input("Quantidade de usuários: "))
username_base = input("Nome de usuário base: ")
pass_base = input("Senha base: ")
ip = input("IP: ")

for i in range(qtd):
    username = username_base + str(i)
    password = pass_base

    body = {'username': username, 'password': password}
    headers = {'Content-Type': 'application/json'}

    response = requests.post('http://%s:3001/api/usuarios/' % ip, data=json.dumps(body), headers=headers)
    print('Resultado %d: %s' % (i, response))
