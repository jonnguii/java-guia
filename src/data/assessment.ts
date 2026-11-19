import type { AreaId, Question } from './types'

export type AssessmentQuestion = Question & { id: string; area: AreaId; weight: 1 | 2 }

/**
 * Duas questões por área: uma de reconhecimento (peso 1) e uma de aplicação (peso 2).
 * A pontuação da área é (pontos obtidos / 3).
 */
export const ASSESSMENT: AssessmentQuestion[] = [
  {
    id: 'f1',
    area: 'fundamentos',
    weight: 1,
    q: 'Qual valor é impresso?',
    code: `int x = 10;
x += 5 * 2;
System.out.println(x);`,
    options: ['30', '20', '25', '15'],
    answer: 1,
    why: 'A multiplicação acontece primeiro: 5 * 2 = 10, e x += 10 resulta em 20.',
  },
  {
    id: 'f2',
    area: 'fundamentos',
    weight: 2,
    q: 'Qual valor é impresso?',
    code: `String a = "oi";
String b = new String("oi");
System.out.println(a == b);`,
    options: ['true', 'false', 'Erro de compilação', 'oi'],
    answer: 1,
    why: '== compara referências. new String cria outro objeto, mesmo com o mesmo conteúdo.',
  },
  {
    id: 'o1',
    area: 'poo',
    weight: 1,
    q: 'O que é encapsulamento?',
    options: [
      'Herdar métodos de outra classe',
      'Esconder o estado interno e expor comportamento por métodos',
      'Criar várias classes no mesmo arquivo',
      'Converter primitivos em objetos',
    ],
    answer: 1,
    why: 'Encapsular é proteger os dados com private e permitir alterações só por métodos que validam.',
  },
  {
    id: 'o2',
    area: 'poo',
    weight: 2,
    q: 'O que é impresso?',
    code: `class A { String nome() { return "A"; } }
class B extends A {
    @Override String nome() { return "B"; }
}

A obj = new B();
System.out.println(obj.nome());`,
    options: ['A', 'B', 'Erro de compilação', 'AB'],
    answer: 1,
    why: 'O método executado é o do objeto real (B), não o do tipo da variável. Isso é polimorfismo.',
  },
  {
    id: 'e1',
    area: 'excecoes',
    weight: 1,
    q: 'Qual exceção o compilador obriga a tratar ou declarar?',
    options: ['NullPointerException', 'IOException', 'IndexOutOfBoundsException', 'IllegalStateException'],
    answer: 1,
    why: 'IOException é checked. As outras estendem RuntimeException.',
  },
  {
    id: 'e2',
    area: 'excecoes',
    weight: 2,
    q: 'Quando o bloco finally é executado?',
    options: [
      'Só quando ocorre uma exceção',
      'Só quando não ocorre exceção',
      'Sempre que o try termina, inclusive com return',
      'Nunca, se houver catch',
    ],
    answer: 2,
    why: 'O finally roda ao sair do try por qualquer caminho. A exceção é a JVM ser encerrada no meio, como com System.exit.',
  },
  {
    id: 'c1',
    area: 'colecoes',
    weight: 1,
    q: 'Qual estrutura busca um valor pela chave em tempo constante, em média?',
    options: ['ArrayList', 'LinkedList', 'HashMap', 'TreeMap'],
    answer: 2,
    why: 'HashMap usa o hash da chave para ir direto ao balde. TreeMap é O(log n).',
  },
  {
    id: 'c2',
    area: 'colecoes',
    weight: 2,
    q: 'Em um parâmetro List<? super Integer>, o que você pode adicionar com segurança?',
    options: ['Qualquer Number', 'Integer', 'Qualquer Object', 'Nada'],
    answer: 1,
    why: 'A lista pode ser de Integer, Number ou Object. O único tipo que cabe em todas é Integer.',
  },
  {
    id: 'l1',
    area: 'funcional',
    weight: 1,
    q: 'Qual o resultado?',
    code: `List.of(1, 2, 3, 4).stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 10)
    .toList();`,
    options: ['[10, 30]', '[20, 40]', '[2, 4]', '[10, 20, 30, 40]'],
    answer: 1,
    why: 'Ficam os pares (2 e 4), que são multiplicados por 10.',
  },
  {
    id: 'l2',
    area: 'funcional',
    weight: 2,
    q: 'O que é impresso?',
    code: `Stream.of("a", "b", "c")
    .peek(System.out::print)
    .findFirst();`,
    options: ['abc', 'a', 'Nada', 'Erro de compilação'],
    answer: 1,
    why: 'Streams processam um elemento por vez. findFirst para no primeiro, então só "a" passa pelo peek.',
  },
  {
    id: 't1',
    area: 'concorrencia',
    weight: 1,
    q: 'Duas threads executam contador++ mil vezes cada, sem sincronização. O valor final:',
    options: ['É sempre 2000', 'Pode ser menor que 2000', 'É sempre 1000', 'Causa erro de compilação'],
    answer: 1,
    why: 'contador++ lê, soma e grava em passos separados. Incrementos simultâneos se perdem.',
  },
  {
    id: 't2',
    area: 'concorrencia',
    weight: 2,
    q: 'Em que cenário threads virtuais trazem mais ganho?',
    options: [
      'Renderizar vídeo usando todos os núcleos',
      'Um servidor que atende milhares de requisições que esperam banco e rede',
      'Um script que roda uma tarefa só',
      'Ordenar um array grande em memória',
    ],
    answer: 1,
    why: 'Threads virtuais liberam a thread do sistema durante a espera por I/O. Trabalho de CPU não se beneficia.',
  },
  {
    id: 'j1',
    area: 'jvm',
    weight: 1,
    q: 'Onde ficam as variáveis locais primitivas de um método?',
    options: ['Na heap', 'Na stack da thread', 'No metaspace', 'Em disco'],
    answer: 1,
    why: 'Cada chamada cria um frame na stack da thread, com as variáveis locais.',
  },
  {
    id: 'j2',
    area: 'jvm',
    weight: 2,
    q: 'O que o compilador JIT faz?',
    options: [
      'Converte .java em .class',
      'Compila trechos de bytecode muito executados em código nativo, durante a execução',
      'Libera memória de objetos sem uso',
      'Verifica erros de sintaxe antes de rodar',
    ],
    answer: 1,
    why: 'O JIT observa os pontos quentes e gera código de máquina otimizado para eles.',
  },
  {
    id: 's1',
    area: 'ecossistema',
    weight: 1,
    q: 'Qual arquivo descreve um projeto Maven?',
    options: ['build.gradle', 'pom.xml', 'package.json', 'settings.java'],
    answer: 1,
    why: 'O pom.xml (Project Object Model) define coordenadas, dependências e plugins.',
  },
  {
    id: 's2',
    area: 'ecossistema',
    weight: 2,
    q: 'No Spring, quando @Autowired no construtor é dispensável?',
    options: [
      'Nunca',
      'Quando a classe tem um único construtor',
      'Quando os campos são public',
      'Apenas em testes',
    ],
    answer: 1,
    why: 'Desde o Spring 4.3, um construtor único é usado para injeção automaticamente.',
  },
]
