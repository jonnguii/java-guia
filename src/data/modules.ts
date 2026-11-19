import type { Module } from './types'

export const MODULES: Module[] = [
  // ───────────────────────────── Fundamentos ─────────────────────────────
  {
    id: 'primeiro-programa',
    stage: 'base',
    area: 'fundamentos',
    title: 'Ambiente e primeiro programa',
    summary: 'JDK, JVM, bytecode e o caminho de um arquivo .java até a execução.',
    minutes: 12,
    signature: 'System.out.println("Olá, Java!");',
    sections: [
      {
        title: 'JDK, JVM e bytecode',
        blocks: [
          {
            kind: 'text',
            body: 'A **JVM** (Java Virtual Machine) executa **bytecode**, um formato intermediário que roda igual em Windows, Linux e macOS. O **JDK** (Java Development Kit) traz o compilador `javac`, a própria JVM e ferramentas como `jshell`, `jar` e `jcmd`.',
          },
          {
            kind: 'list',
            items: [
              'Você escreve `Main.java`.',
              '`javac` compila para `Main.class` (bytecode).',
              'A JVM carrega o bytecode, interpreta e compila os trechos mais usados para código nativo (JIT).',
            ],
          },
          {
            kind: 'tip',
            body: 'Instale um JDK **LTS** (suporte de longo prazo): 17, 21 ou 25. Distribuições como Eclipse Temurin são gratuitas. O SDKMAN (`sdk list java`) ajuda a instalar e alternar versões.',
          },
        ],
      },
      {
        title: 'O clássico Hello, World',
        blocks: [
          {
            kind: 'code',
            code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Java!");
    }
}`,
          },
          {
            kind: 'code',
            lang: 'shell',
            code: `javac Main.java   # gera Main.class
java Main         # executa

java Main.java    # Java 11+: compila e executa direto`,
            caption: 'No terminal',
          },
          {
            kind: 'pitfall',
            body: 'O nome de uma classe `public` precisa ser igual ao nome do arquivo. `public class Main` só compila dentro de `Main.java`.',
          },
        ],
      },
      {
        title: 'Java 25: menos cerimônia',
        blocks: [
          {
            kind: 'text',
            body: 'No Java 25 os **arquivos-fonte compactos** saíram de preview. Para programas pequenos, você pode escrever só o método `main`, sem declarar classe, e usar a nova classe `java.lang.IO` para ler e escrever no console.',
          },
          {
            kind: 'code',
            code: `void main() {
    String nome = IO.readln("Seu nome: ");
    IO.println("Olá, " + nome + "!");
}`,
            caption: 'Main.java — execute com: java Main.java',
          },
          {
            kind: 'tip',
            body: 'Use o `jshell` para testar uma linha de código sem criar arquivo nenhum. Ótimo para tirar dúvidas rápidas.',
          },
        ],
      },
    ],
    checklist: [
      'Explicar a diferença entre JDK e JVM',
      'Compilar e executar um programa pelo terminal',
      'Dizer o que é uma versão LTS e qual usar',
    ],
    quiz: [
      {
        q: 'O que o comando javac produz?',
        options: ['Código de máquina nativo', 'Bytecode em arquivos .class', 'Um arquivo .jar', 'Código JavaScript'],
        answer: 1,
        why: 'O javac compila código-fonte em bytecode (.class). Quem transforma bytecode em código nativo é o JIT, dentro da JVM, durante a execução.',
      },
      {
        q: 'Qual destas versões é LTS?',
        options: ['Java 22', 'Java 23', 'Java 25', 'Java 24'],
        answer: 2,
        why: 'As versões LTS recentes são 17, 21 e 25. As intermediárias recebem atualizações por apenas seis meses.',
      },
    ],
  },
  {
    id: 'variaveis-tipos',
    stage: 'base',
    area: 'fundamentos',
    title: 'Variáveis e tipos',
    summary: 'Os oito primitivos, wrappers, conversões e por que double não serve para dinheiro.',
    minutes: 15,
    signature: 'var total = new BigDecimal("19.90");',
    sections: [
      {
        title: 'Os oito tipos primitivos',
        blocks: [
          {
            kind: 'code',
            code: `byte    b = 127;            // 8 bits
short   s = 32_000;         // 16 bits
int     i = 2_000_000_000;  // 32 bits, o padrão para inteiros
long    l = 9_000_000_000L; // 64 bits, repare no L
float   f = 3.14f;          // 32 bits
double  d = 3.14;           // 64 bits, o padrão para decimais
char    c = 'J';            // 16 bits, um caractere UTF-16
boolean ok = true;`,
          },
          {
            kind: 'text',
            body: 'Primitivos guardam o valor direto e não podem ser `null`. Todo o resto (String, List, suas classes) são **tipos de referência**: a variável guarda um endereço para o objeto.',
          },
        ],
      },
      {
        title: 'Wrappers e autoboxing',
        blocks: [
          {
            kind: 'text',
            body: 'Cada primitivo tem uma classe correspondente: `Integer`, `Long`, `Double`, `Boolean`... O compilador converte entre eles automaticamente (autoboxing). Coleções só aceitam objetos, por isso `List<Integer>` e nunca `List<int>`.',
          },
          {
            kind: 'code',
            code: `Integer a = 127, b = 127;
System.out.println(a == b);      // true: valores de -128 a 127 vêm de um cache

Integer c = 128, d = 128;
System.out.println(c == d);      // false: dois objetos diferentes
System.out.println(c.equals(d)); // true: compara o valor`,
          },
          {
            kind: 'pitfall',
            body: 'Nunca compare wrappers com `==`. Use `equals`. E cuidado: fazer unboxing de um `Integer` nulo lança `NullPointerException`.',
          },
        ],
      },
      {
        title: 'Conversões, var e overflow',
        blocks: [
          {
            kind: 'code',
            code: `int inteiro = (int) 3.99;      // 3: o cast trunca, não arredonda
byte estouro = (byte) 130;     // -126: sobraram só os 8 bits menos significativos
long seguro = 10;              // int -> long é automático (alargamento)

var nomes = new ArrayList<String>(); // var infere ArrayList<String>

int max = Integer.MAX_VALUE;
System.out.println(max + 1);   // -2147483648: overflow silencioso
Math.addExact(max, 1);         // lança ArithmeticException`,
          },
          {
            kind: 'text',
            body: '`var` (Java 10) só funciona em variáveis locais. O tipo continua estático: o compilador apenas o deduz do lado direito.',
          },
        ],
      },
      {
        title: 'Dinheiro pede BigDecimal',
        blocks: [
          {
            kind: 'code',
            code: `System.out.println(0.1 + 0.2);  // 0.30000000000000004

BigDecimal preco = new BigDecimal("0.1");
BigDecimal total = preco.add(new BigDecimal("0.2")); // 0.3`,
          },
          {
            kind: 'pitfall',
            body: 'Crie `BigDecimal` a partir de String. `new BigDecimal(0.1)` herda a imprecisão do double e vira 0.1000000000000000055511151231257827...',
          },
        ],
      },
    ],
    checklist: [
      'Listar os 8 tipos primitivos e seus tamanhos',
      'Explicar por que não comparar Integer com ==',
      'Escolher BigDecimal para valores monetários',
    ],
    quiz: [
      {
        q: 'Qual é o resultado da expressão?',
        code: 'int x = (int) 3.99;',
        options: ['4', '3', '3.99', 'Erro de compilação'],
        answer: 1,
        why: 'O cast de double para int descarta a parte decimal. Para arredondar, use Math.round.',
      },
      {
        q: 'Qual tipo usar para guardar o saldo de uma conta bancária?',
        options: ['double', 'float', 'BigDecimal', 'long com vírgula'],
        answer: 2,
        why: 'double e float representam decimais em base 2 e acumulam erros de arredondamento. BigDecimal é exato.',
      },
    ],
  },
  {
    id: 'controle-fluxo',
    stage: 'base',
    area: 'fundamentos',
    title: 'Operadores e controle de fluxo',
    summary: 'Decisões, laços e o switch moderno que devolve valor.',
    minutes: 12,
    signature: 'var tipo = switch (dia) { case SATURDAY, SUNDAY -> "folga"; default -> "útil"; };',
    sections: [
      {
        title: 'Operadores que pegam iniciantes',
        blocks: [
          {
            kind: 'code',
            code: `System.out.println(7 / 2);    // 3: divisão entre inteiros descarta o resto
System.out.println(7 / 2.0);  // 3.5
System.out.println(7 % 2);    // 1
System.out.println(-7 % 2);   // -1: o resto tem o sinal do dividendo

int i = 5;
int a = i++;  // a = 5, depois i = 6
int b = ++i;  // i = 7, depois b = 7`,
          },
          {
            kind: 'text',
            body: '`&&` e `||` são de curto-circuito: se o lado esquerdo já decide o resultado, o direito não roda. Por isso `obj != null && obj.isValido()` é seguro.',
          },
        ],
      },
      {
        title: 'if, ternário e switch',
        blocks: [
          {
            kind: 'code',
            code: `String faixa = idade >= 18 ? "adulto" : "menor";

String tipo = switch (dia) {          // dia é um DayOfWeek
    case SATURDAY, SUNDAY -> "fim de semana";
    case FRIDAY -> {
        log("sextou");
        yield "quase lá";             // yield devolve o valor de um bloco
    }
    default -> "dia útil";
};`,
          },
          {
            kind: 'tip',
            body: 'Prefira o switch com seta (`->`, Java 14). Não existe fall-through, então esquecer um `break` deixa de ser um bug possível.',
          },
        ],
      },
      {
        title: 'Laços',
        blocks: [
          {
            kind: 'code',
            code: `for (int i = 0; i < 3; i++) { ... }       // contador
for (String nome : nomes) { ... }         // for-each
while (fila.hasNext()) { ... }            // condição no início
do { tentar(); } while (!sucesso);        // roda pelo menos uma vez

externo:
for (int[] linha : matriz) {
    for (int valor : linha) {
        if (valor < 0) break externo;     // sai dos dois laços
    }
}`,
          },
        ],
      },
    ],
    checklist: [
      'Prever o resultado de divisões entre inteiros',
      'Usar switch como expressão com yield',
      'Escolher entre for, for-each e while',
    ],
    quiz: [
      {
        q: 'O que é impresso?',
        code: 'System.out.println(7 / 2);',
        options: ['3.5', '3', '4', '3.0'],
        answer: 1,
        why: 'Os dois operandos são int, então a divisão é inteira. Para obter 3.5, pelo menos um deles precisa ser double.',
      },
      {
        q: 'Qual a vantagem do switch com seta (->) sobre o switch tradicional?',
        options: [
          'É mais rápido em tempo de execução',
          'Aceita qualquer tipo de objeto',
          'Não tem fall-through e pode devolver um valor',
          'Dispensa o caso default sempre',
        ],
        answer: 2,
        why: 'Cada caso com seta executa só o seu lado direito, e o switch pode ser usado como expressão, atribuindo o resultado a uma variável.',
      },
    ],
  },
  {
    id: 'arrays-strings',
    stage: 'base',
    area: 'fundamentos',
    title: 'Arrays e Strings',
    summary: 'Coleções de tamanho fixo, a imutabilidade da String e a armadilha do ==.',
    minutes: 14,
    signature: '"java".equals(entrada)',
    sections: [
      {
        title: 'Arrays',
        blocks: [
          {
            kind: 'code',
            code: `int[] notas = new int[3];             // [0, 0, 0]: valores padrão
String[] nomes = {"Ana", "Bruno"};     // tamanho 2, fixo para sempre
int[][] grade = new int[3][4];         // matriz 3x4

notas[0] = 9;
System.out.println(notas.length);          // 3
System.out.println(Arrays.toString(notas)); // [9, 0, 0]
Arrays.sort(nomes);`,
          },
          {
            kind: 'pitfall',
            body: 'Acessar `notas[3]` em um array de tamanho 3 lança `ArrayIndexOutOfBoundsException`. Índices vão de 0 a `length - 1`.',
          },
        ],
      },
      {
        title: 'String é imutável',
        blocks: [
          {
            kind: 'text',
            body: 'Nenhum método altera uma String. `toUpperCase()`, `replace()` e `strip()` devolvem uma **nova** String. Isso torna Strings seguras para compartilhar entre threads e usar como chave de mapa.',
          },
          {
            kind: 'code',
            code: `String a = "java";
String b = "java";
String c = new String("java");

a == b        // true: literais iguais vêm do mesmo pool
a == c        // false: c é outro objeto
a.equals(c)   // true: mesmo conteúdo

"java".equals(entrada)  // seguro mesmo se entrada for null`,
          },
        ],
      },
      {
        title: 'Métodos úteis e StringBuilder',
        blocks: [
          {
            kind: 'code',
            code: `"  oi  ".strip()          // "oi"
"   ".isBlank()           // true
"ab".repeat(3)            // "ababab"
"a,b,c".split(",")        // ["a", "b", "c"]
"%s tem %d anos".formatted("Ana", 30)

var sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append(i).append(';');
String resultado = sb.toString();

String json = """
    { "nome": "Ana" }
    """;                  // text block, Java 15`,
          },
          {
            kind: 'tip',
            body: 'Concatenar com `+` dentro de um laço cria uma String nova a cada volta. Para montar texto em laço, use `StringBuilder`.',
          },
        ],
      },
    ],
    checklist: [
      'Explicar a diferença entre == e equals em Strings',
      'Usar StringBuilder para montar texto em laços',
      'Percorrer e ordenar um array com a classe Arrays',
    ],
    quiz: [
      {
        q: 'Qual o conteúdo de new int[3] logo após a criação?',
        options: ['[null, null, null]', '[0, 0, 0]', 'Valores aleatórios', 'Lança exceção'],
        answer: 1,
        why: 'Arrays são sempre inicializados com o valor padrão do tipo: 0 para números, false para boolean e null para referências.',
      },
      {
        q: 'Qual a melhor forma de concatenar 10 mil Strings em um laço?',
        options: ['Usar + a cada volta', 'StringBuilder', 'String.concat', 'Um array de char'],
        answer: 1,
        why: 'StringBuilder é mutável e cresce o buffer conforme precisa, evitando criar milhares de Strings intermediárias.',
      },
    ],
  },
  {
    id: 'metodos',
    stage: 'base',
    area: 'fundamentos',
    title: 'Métodos',
    summary: 'Parâmetros, retorno, sobrecarga e por que Java sempre passa por valor.',
    minutes: 12,
    signature: 'static int somar(int... numeros)',
    sections: [
      {
        title: 'Anatomia de um método',
        blocks: [
          {
            kind: 'code',
            code: `//  modificadores  retorno  nome     parâmetros
    public static  double   media(int[] valores) {
        if (valores.length == 0) return 0;
        int soma = 0;
        for (int v : valores) soma += v;
        return (double) soma / valores.length;
    }`,
          },
          {
            kind: 'text',
            body: 'Métodos `static` pertencem à classe e são chamados como `Calculos.media(...)`. Métodos de instância precisam de um objeto e podem acessar os campos dele.',
          },
        ],
      },
      {
        title: 'Java sempre passa por valor',
        blocks: [
          {
            kind: 'text',
            body: 'O método recebe uma **cópia** do argumento. Para objetos, a cópia é da referência: dá para alterar o objeto apontado, mas trocar a referência não afeta quem chamou.',
          },
          {
            kind: 'code',
            code: `static void exclamar(StringBuilder sb) {
    sb.append("!");                  // altera o objeto original
}

static void trocar(StringBuilder sb) {
    sb = new StringBuilder("novo");  // muda só a cópia local
}

var texto = new StringBuilder("oi");
exclamar(texto);   // texto = "oi!"
trocar(texto);     // texto continua "oi!"`,
          },
        ],
      },
      {
        title: 'Sobrecarga, varargs e recursão',
        blocks: [
          {
            kind: 'code',
            code: `static int somar(int a, int b) { return a + b; }
static double somar(double a, double b) { return a + b; } // sobrecarga
static int somar(int... numeros) {                        // varargs
    return Arrays.stream(numeros).sum();
}

static long fatorial(int n) {
    return n <= 1 ? 1 : n * fatorial(n - 1);
}`,
          },
          {
            kind: 'pitfall',
            body: 'Recursão sem caso base (ou profunda demais) estoura a pilha com `StackOverflowError`. Sobrecarga depende só da lista de parâmetros; mudar apenas o tipo de retorno não compila.',
          },
        ],
      },
    ],
    checklist: [
      'Explicar a passagem por valor com objetos',
      'Diferenciar métodos static e de instância',
      'Escrever uma função recursiva com caso base',
    ],
    quiz: [
      {
        q: 'Como Java passa objetos para métodos?',
        options: [
          'Por referência: o método pode trocar o objeto de quem chamou',
          'Por valor: o método recebe uma cópia da referência',
          'Por cópia profunda do objeto',
          'Depende se o objeto é mutável',
        ],
        answer: 1,
        why: 'Java é sempre pass-by-value. Com objetos, o valor copiado é a referência, por isso alterar o objeto funciona mas reatribuir o parâmetro não.',
      },
      {
        q: 'Dois métodos sobrecarregados precisam diferir em:',
        options: ['Tipo de retorno', 'Nome dos parâmetros', 'Lista de tipos dos parâmetros', 'Modificador de acesso'],
        answer: 2,
        why: 'O compilador escolhe a sobrecarga pela quantidade e pelos tipos dos argumentos. Retorno e nomes de parâmetros não contam.',
      },
    ],
  },

  // ───────────────────────────── Orientação a Objetos ─────────────────────────────
  {
    id: 'classes-objetos',
    stage: 'objetos',
    area: 'poo',
    title: 'Classes e objetos',
    summary: 'Construtores, encapsulamento e objetos que protegem o próprio estado.',
    minutes: 15,
    signature: 'private final String titular;',
    sections: [
      {
        title: 'Uma classe que se protege',
        blocks: [
          {
            kind: 'code',
            code: `public class ContaBancaria {
    private final String titular;
    private BigDecimal saldo = BigDecimal.ZERO;

    public ContaBancaria(String titular) {
        if (titular == null || titular.isBlank())
            throw new IllegalArgumentException("titular é obrigatório");
        this.titular = titular;
    }

    public void depositar(BigDecimal valor) {
        if (valor.signum() <= 0)
            throw new IllegalArgumentException("o depósito deve ser positivo");
        saldo = saldo.add(valor);
    }

    public BigDecimal saldo() { return saldo; }
}`,
          },
          {
            kind: 'text',
            body: '**Encapsular** é esconder o estado (`private`) e expor comportamento. Ninguém de fora consegue deixar o saldo negativo, porque a única porta de entrada é `depositar`, que valida.',
          },
        ],
      },
      {
        title: 'Modificadores de acesso',
        blocks: [
          {
            kind: 'list',
            items: [
              '`public`: visível em qualquer lugar.',
              '`protected`: mesmo pacote e subclasses.',
              'sem modificador (package-private): só no mesmo pacote.',
              '`private`: só dentro da própria classe.',
            ],
          },
          {
            kind: 'tip',
            body: 'Comece com o acesso mais restrito e abra só quando precisar. Campos quase sempre devem ser `private`.',
          },
        ],
      },
      {
        title: 'Construtores, this e static',
        blocks: [
          {
            kind: 'code',
            code: `public class Produto {
    private static int criados = 0;  // compartilhado por todos os objetos
    private final String nome;
    private final int estoque;

    public Produto(String nome) {
        this(nome, 0);                // chama o outro construtor
    }

    public Produto(String nome, int estoque) {
        this.nome = nome;             // this diferencia campo de parâmetro
        this.estoque = estoque;
        criados++;
    }
}`,
          },
          {
            kind: 'pitfall',
            body: 'Se você declara qualquer construtor, o compilador deixa de gerar o construtor vazio. `new Produto()` passa a não compilar.',
          },
        ],
      },
    ],
    checklist: [
      'Criar uma classe com campos privados e validação no construtor',
      'Explicar os quatro níveis de acesso',
      'Usar this() para encadear construtores',
    ],
    quiz: [
      {
        q: 'Um membro sem modificador de acesso é visível:',
        options: ['Em qualquer lugar', 'Apenas na própria classe', 'No mesmo pacote', 'Apenas em subclasses'],
        answer: 2,
        why: 'Sem modificador, o acesso é package-private: qualquer classe do mesmo pacote enxerga o membro.',
      },
      {
        q: 'O que acontece com o construtor padrão quando você declara um construtor com parâmetros?',
        options: [
          'Continua existindo',
          'Deixa de ser gerado pelo compilador',
          'Passa a ser private',
          'Vira um método static',
        ],
        answer: 1,
        why: 'O construtor sem argumentos só é gerado quando a classe não declara nenhum construtor.',
      },
    ],
  },
  {
    id: 'heranca-polimorfismo',
    stage: 'objetos',
    area: 'poo',
    title: 'Herança e polimorfismo',
    summary: 'extends, @Override, classes abstratas e quando preferir composição.',
    minutes: 15,
    signature: 'abstract double area();',
    sections: [
      {
        title: 'Polimorfismo na prática',
        blocks: [
          {
            kind: 'code',
            code: `abstract class Forma {
    abstract double area();
}

final class Circulo extends Forma {
    private final double raio;
    Circulo(double raio) { this.raio = raio; }

    @Override
    double area() { return Math.PI * raio * raio; }
}

final class Retangulo extends Forma {
    private final double largura, altura;
    Retangulo(double largura, double altura) {
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    double area() { return largura * altura; }
}

List<Forma> formas = List.of(new Circulo(1), new Retangulo(2, 3));
double total = formas.stream().mapToDouble(Forma::area).sum();`,
          },
          {
            kind: 'text',
            body: 'A variável tem o tipo `Forma`, mas o método executado é o do objeto real. Essa decisão acontece em tempo de execução e se chama **despacho dinâmico**.',
          },
        ],
      },
      {
        title: 'Regras importantes',
        blocks: [
          {
            kind: 'list',
            items: [
              'Uma classe estende só **uma** classe, mas pode implementar várias interfaces.',
              '`super.metodo()` chama a versão da superclasse; `super(...)` chama o construtor dela e precisa vir antes de usar `this`.',
              '`@Override` faz o compilador conferir que você realmente está sobrescrevendo.',
              'Métodos `static` e campos não são polimórficos: eles são ocultados, não sobrescritos.',
              '`final` em uma classe impede herança; em um método, impede sobrescrita.',
            ],
          },
        ],
      },
      {
        title: 'Composição antes de herança',
        blocks: [
          {
            kind: 'text',
            body: 'Herança cria um acoplamento forte: mudanças na superclasse quebram as filhas. Use herança só para relações "é um" verdadeiras. Para reaproveitar comportamento, prefira guardar o objeto como campo.',
          },
          {
            kind: 'code',
            code: `// Em vez de: class Pedido extends ArrayList<Item>
class Pedido {
    private final List<Item> itens = new ArrayList<>();
    void adicionar(Item item) { itens.add(item); }
}`,
          },
        ],
      },
    ],
    checklist: [
      'Explicar despacho dinâmico com um exemplo',
      'Usar classe abstrata e @Override',
      'Justificar quando preferir composição',
    ],
    quiz: [
      {
        q: 'Java permite herança múltipla de classes?',
        options: [
          'Sim, com a palavra-chave extends separada por vírgulas',
          'Não, mas uma classe pode implementar várias interfaces',
          'Sim, desde o Java 8',
          'Só com classes abstratas',
        ],
        answer: 1,
        why: 'Uma classe tem exatamente uma superclasse. Interfaces permitem combinar vários contratos.',
      },
      {
        q: 'Para que serve a anotação @Override?',
        options: [
          'Torna o método mais rápido',
          'É obrigatória para sobrescrever',
          'Faz o compilador verificar que o método realmente sobrescreve outro',
          'Impede que subclasses sobrescrevam o método',
        ],
        answer: 2,
        why: 'Ela é opcional, mas pega erros como um nome digitado errado, que criaria um método novo em vez de sobrescrever.',
      },
    ],
  },
  {
    id: 'interfaces',
    stage: 'objetos',
    area: 'poo',
    title: 'Interfaces',
    summary: 'Contratos, métodos default, interfaces funcionais e hierarquias seladas.',
    minutes: 13,
    signature: 'sealed interface Pagamento permits Pix, Cartao {}',
    sections: [
      {
        title: 'Interface é contrato',
        blocks: [
          {
            kind: 'code',
            code: `public interface Notificador {
    void enviar(String destino, String mensagem);   // abstrato

    default void enviarTodos(List<String> destinos, String msg) {
        destinos.forEach(d -> enviar(d, msg));       // Java 8+
    }

    static Notificador console() {                   // fábrica estática
        return (destino, msg) -> System.out.println(destino + ": " + msg);
    }
}`,
          },
          {
            kind: 'text',
            body: 'Quem depende de `Notificador` não sabe se a mensagem vai por e-mail, SMS ou console. Isso deixa o código fácil de testar e de trocar implementações.',
          },
        ],
      },
      {
        title: 'Interfaces funcionais',
        blocks: [
          {
            kind: 'text',
            body: 'Uma interface com **exatamente um** método abstrato pode ser implementada por uma lambda. `@FunctionalInterface` é opcional, mas faz o compilador garantir a regra.',
          },
          {
            kind: 'code',
            code: `@FunctionalInterface
interface Desconto {
    BigDecimal aplicar(BigDecimal valor);
}

Desconto blackFriday = v -> v.multiply(new BigDecimal("0.7"));`,
          },
        ],
      },
      {
        title: 'Interfaces seladas',
        blocks: [
          {
            kind: 'code',
            code: `public sealed interface Pagamento permits Pix, Cartao, Boleto {}

public record Pix(String chave) implements Pagamento {}
public record Cartao(String numero, int parcelas) implements Pagamento {}
public record Boleto(String codigo) implements Pagamento {}`,
          },
          {
            kind: 'text',
            body: '`sealed` (Java 17) fecha a lista de implementações. O compilador passa a saber todos os casos possíveis, o que habilita o switch exaustivo visto no módulo de pattern matching.',
          },
          {
            kind: 'tip',
            body: 'Classe abstrata ou interface? Use classe abstrata quando precisar de estado compartilhado (campos) ou construtor. Para definir capacidades, use interface.',
          },
        ],
      },
    ],
    checklist: [
      'Criar uma interface com método default',
      'Implementar uma interface funcional com lambda',
      'Explicar o que sealed garante ao compilador',
    ],
    quiz: [
      {
        q: 'Uma interface funcional tem:',
        options: [
          'Somente métodos default',
          'Exatamente um método abstrato',
          'Nenhum método',
          'Pelo menos dois métodos abstratos',
        ],
        answer: 1,
        why: 'Um único método abstrato é o que permite que uma lambda a implemente. Métodos default e static não contam.',
      },
      {
        q: 'O que sealed faz em uma interface?',
        options: [
          'Impede que ela tenha métodos default',
          'Torna todos os métodos final',
          'Restringe quais classes podem implementá-la',
          'Impede o uso em lambdas',
        ],
        answer: 2,
        why: 'Só os tipos listados em permits podem implementar a interface selada.',
      },
    ],
  },
  {
    id: 'records-enums',
    stage: 'objetos',
    area: 'poo',
    title: 'Records, enums e imutabilidade',
    summary: 'Dados sem boilerplate, conjuntos fechados de valores e objetos que não mudam.',
    minutes: 13,
    signature: 'record Ponto(int x, int y) {}',
    sections: [
      {
        title: 'Records',
        blocks: [
          {
            kind: 'code',
            code: `public record Email(String valor) {
    public Email {                                   // construtor compacto
        if (valor == null || !valor.contains("@"))
            throw new IllegalArgumentException("e-mail inválido: " + valor);
        valor = valor.toLowerCase();
    }
}

var e = new Email("Ana@Exemplo.com");
e.valor();          // "ana@exemplo.com"  (acessor sem "get")
e.toString();       // Email[valor=ana@exemplo.com]`,
          },
          {
            kind: 'text',
            body: 'Um record (Java 16) gera construtor, acessores, `equals`, `hashCode` e `toString`. Os campos são `final` e a classe não pode ser estendida.',
          },
          {
            kind: 'pitfall',
            body: 'A imutabilidade é rasa. Um record com `List<String>` ainda permite alterar a lista por fora. Faça `itens = List.copyOf(itens)` no construtor compacto.',
          },
        ],
      },
      {
        title: 'Enums com comportamento',
        blocks: [
          {
            kind: 'code',
            code: `public enum Plano {
    GRATIS(0), PRO(29), EMPRESA(99);

    private final int precoMensal;
    Plano(int precoMensal) { this.precoMensal = precoMensal; }

    public int precoAnual() { return precoMensal * 12 * 85 / 100; }
}

Plano.valueOf("PRO").precoAnual();   // 295
for (Plano p : Plano.values()) { ... }
var limites = new EnumMap<Plano, Integer>(Plano.class);`,
          },
        ],
      },
      {
        title: 'Por que imutável',
        blocks: [
          {
            kind: 'list',
            items: [
              'Pode ser compartilhado entre threads sem sincronização.',
              'É seguro como chave de `HashMap`.',
              'Elimina uma classe inteira de bugs: "quem mudou esse objeto?".',
            ],
          },
          {
            kind: 'code',
            code: `List<String> fixa = List.of("a", "b");
fixa.add("c");   // UnsupportedOperationException`,
          },
        ],
      },
    ],
    checklist: [
      'Criar um record com validação no construtor compacto',
      'Adicionar campos e métodos a um enum',
      'Fazer cópias defensivas de coleções',
    ],
    quiz: [
      {
        q: 'Em record Pessoa(String nome) {}, como se lê o nome?',
        options: ['pessoa.getNome()', 'pessoa.nome', 'pessoa.nome()', 'pessoa.get("nome")'],
        answer: 2,
        why: 'Records geram acessores com o mesmo nome do componente, sem o prefixo get.',
      },
      {
        q: 'O que acontece ao executar List.of(1, 2).add(3)?',
        options: [
          'A lista vira [1, 2, 3]',
          'Erro de compilação',
          'Lança UnsupportedOperationException',
          'Retorna false',
        ],
        answer: 2,
        why: 'List.of devolve uma lista imutável. A chamada compila, mas falha em tempo de execução.',
      },
    ],
  },
  {
    id: 'equals-hashcode',
    stage: 'objetos',
    area: 'poo',
    title: 'equals, hashCode e comparação',
    summary: 'Os contratos que HashMap e HashSet assumem que você cumpriu.',
    minutes: 12,
    signature: 'Objects.hash(cpf)',
    sections: [
      {
        title: 'O contrato',
        blocks: [
          {
            kind: 'text',
            body: 'Se `a.equals(b)` é `true`, então `a.hashCode() == b.hashCode()` **precisa** ser `true`. O contrário não vale: hashes iguais podem vir de objetos diferentes (colisão).',
          },
          {
            kind: 'code',
            code: `public final class Cliente {
    private final String cpf;
    private String nome;   // pode mudar, então fica fora do equals

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cliente outro)) return false;
        return cpf.equals(outro.cpf);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cpf);
    }
}`,
          },
          {
            kind: 'pitfall',
            body: 'Sobrescrever `equals` sem `hashCode` faz o `HashSet` aceitar "duplicatas" e o `HashMap` não encontrar chaves que estão lá.',
          },
        ],
      },
      {
        title: 'Ordenando objetos',
        blocks: [
          {
            kind: 'code',
            code: `record Aluno(String nome, int nota) {}

alunos.sort(Comparator
    .comparingInt(Aluno::nota).reversed()
    .thenComparing(Aluno::nome));`,
          },
          {
            kind: 'text',
            body: '`Comparable` define a ordem natural dentro da própria classe (como String e Integer fazem). `Comparator` define ordens externas, quantas você quiser.',
          },
        ],
      },
    ],
    checklist: [
      'Implementar equals e hashCode coerentes',
      'Explicar o que quebra quando o contrato é violado',
      'Ordenar por mais de um critério com Comparator',
    ],
    quiz: [
      {
        q: 'Você sobrescreveu equals, mas não hashCode. O que pode acontecer?',
        options: [
          'Erro de compilação',
          'Nada, hashCode é opcional',
          'HashSet pode guardar dois objetos "iguais"',
          'equals passa a ser ignorado',
        ],
        answer: 2,
        why: 'O HashSet primeiro procura pelo hash. Com hashes diferentes, ele nem chega a chamar equals.',
      },
      {
        q: 'Se a.equals(b) é true, então:',
        options: [
          'a == b é true',
          'a.hashCode() == b.hashCode() é obrigatoriamente true',
          'a.compareTo(b) é 1',
          'b.equals(a) pode ser false',
        ],
        answer: 1,
        why: 'Objetos iguais devem ter o mesmo hash. equals também precisa ser simétrico, então b.equals(a) deve ser true.',
      },
    ],
  },

  // ───────────────────────────── Intermediário ─────────────────────────────
  {
    id: 'excecoes',
    stage: 'intermediario',
    area: 'excecoes',
    title: 'Exceções',
    summary: 'Checked e unchecked, try-with-resources e como não engolir erros.',
    minutes: 14,
    signature: 'try (var in = Files.newBufferedReader(path)) { ... }',
    sections: [
      {
        title: 'A hierarquia',
        blocks: [
          {
            kind: 'list',
            items: [
              '`Throwable` é a raiz.',
              '`Error`: problemas da JVM, como `OutOfMemoryError`. Não trate.',
              '`Exception` (checked): o compilador obriga a tratar ou declarar com `throws`. Exemplo: `IOException`.',
              '`RuntimeException` (unchecked): erros de programação, como `NullPointerException` e `IllegalArgumentException`.',
            ],
          },
        ],
      },
      {
        title: 'try-with-resources',
        blocks: [
          {
            kind: 'code',
            code: `long contarLinhas(Path arquivo) {
    try (var leitor = Files.newBufferedReader(arquivo)) {
        return leitor.lines().count();
    } catch (IOException e) {
        throw new UncheckedIOException("falha ao ler " + arquivo, e);
    }
}`,
          },
          {
            kind: 'text',
            body: 'Qualquer objeto `AutoCloseable` declarado no `try (...)` é fechado automaticamente, mesmo se uma exceção acontecer. Esqueça o `finally` com `close()` manual.',
          },
        ],
      },
      {
        title: 'Boas práticas',
        blocks: [
          {
            kind: 'code',
            code: `public class SaldoInsuficienteException extends RuntimeException {
    public SaldoInsuficienteException(BigDecimal saldo, BigDecimal pedido) {
        super("saldo " + saldo + " insuficiente para " + pedido);
    }
}

try {
    processar();
} catch (SQLException | IOException e) {          // multi-catch
    throw new FalhaNoProcessamento("pedido " + id, e); // preserve a causa
}`,
          },
          {
            kind: 'pitfall',
            body: 'Um `catch (Exception e) {}` vazio esconde o erro e transforma um bug fácil de achar em horas de investigação. Trate, relance com contexto ou registre no log.',
          },
          {
            kind: 'tip',
            body: 'Falhe cedo: valide argumentos na entrada do método com `Objects.requireNonNull` ou `IllegalArgumentException`.',
          },
        ],
      },
    ],
    checklist: [
      'Diferenciar exceções checked e unchecked',
      'Usar try-with-resources com arquivos',
      'Criar uma exceção de domínio preservando a causa',
    ],
    quiz: [
      {
        q: 'Qual destas exceções é checked?',
        options: ['NullPointerException', 'IllegalArgumentException', 'IOException', 'ArithmeticException'],
        answer: 2,
        why: 'IOException estende Exception, não RuntimeException, então precisa ser tratada ou declarada.',
      },
      {
        q: 'try-with-resources funciona com objetos que implementam:',
        options: ['Serializable', 'AutoCloseable', 'Iterable', 'Runnable'],
        answer: 1,
        why: 'O bloco chama close() de cada recurso AutoCloseable ao sair, na ordem inversa da declaração.',
      },
    ],
  },
  {
    id: 'colecoes',
    stage: 'intermediario',
    area: 'colecoes',
    title: 'Coleções',
    summary: 'List, Set, Map e Deque: qual escolher e quanto custa cada operação.',
    minutes: 16,
    signature: 'freq.merge(palavra, 1, Integer::sum);',
    sections: [
      {
        title: 'Escolhendo a estrutura',
        blocks: [
          {
            kind: 'list',
            items: [
              '`ArrayList`: lista padrão. Acesso por índice O(1), `contains` O(n).',
              '`HashSet`: elementos únicos, sem ordem. `contains` O(1) em média.',
              '`LinkedHashSet` / `LinkedHashMap`: mantêm a ordem de inserção.',
              '`TreeSet` / `TreeMap`: mantêm ordenado. Operações O(log n).',
              '`HashMap`: chave → valor. `get` e `put` O(1) em média.',
              '`ArrayDeque`: pilha ou fila. Prefira a `Stack` e `LinkedList`.',
            ],
          },
          {
            kind: 'tip',
            body: 'Declare pelo tipo da interface: `List<String> nomes = new ArrayList<>();`. Trocar a implementação depois custa uma linha.',
          },
        ],
      },
      {
        title: 'Idiomas de Map',
        blocks: [
          {
            kind: 'code',
            code: `Map<String, Integer> freq = new HashMap<>();
for (String palavra : texto.split("\\\\s+")) {
    freq.merge(palavra, 1, Integer::sum);
}

Map<String, List<Pedido>> porCliente = new HashMap<>();
porCliente.computeIfAbsent(cliente, k -> new ArrayList<>()).add(pedido);

int total = estoque.getOrDefault("caneta", 0);`,
          },
        ],
      },
      {
        title: 'Armadilhas e novidades',
        blocks: [
          {
            kind: 'code',
            code: `for (String n : nomes) {
    if (n.isBlank()) nomes.remove(n);  // ConcurrentModificationException
}
nomes.removeIf(String::isBlank);       // forma correta

// Java 21: coleções sequenciadas
nomes.getFirst();
nomes.getLast();
nomes.reversed();`,
          },
          {
            kind: 'pitfall',
            body: 'Nunca altere uma coleção enquanto a percorre com for-each. Use `removeIf`, um `Iterator` explícito ou monte uma nova coleção.',
          },
        ],
      },
    ],
    checklist: [
      'Escolher entre List, Set e Map para um problema',
      'Usar merge e computeIfAbsent',
      'Remover itens sem ConcurrentModificationException',
    ],
    quiz: [
      {
        q: 'Você precisa de elementos únicos mantendo a ordem de inserção. Qual usar?',
        options: ['HashSet', 'TreeSet', 'LinkedHashSet', 'ArrayList'],
        answer: 2,
        why: 'LinkedHashSet combina a unicidade do HashSet com uma lista ligada que preserva a ordem de inserção.',
      },
      {
        q: 'O que acontece ao remover de uma ArrayList dentro de um for-each sobre ela?',
        options: [
          'Funciona normalmente',
          'Normalmente lança ConcurrentModificationException',
          'Erro de compilação',
          'O item é removido só no fim do laço',
        ],
        answer: 1,
        why: 'O iterador detecta que a lista mudou por fora dele e falha. Use removeIf ou iterator.remove().',
      },
    ],
  },
  {
    id: 'generics',
    stage: 'intermediario',
    area: 'colecoes',
    title: 'Generics',
    summary: 'Tipos parametrizados, wildcards e o princípio PECS.',
    minutes: 14,
    signature: 'static <T extends Comparable<T>> T maior(List<T> lista)',
    sections: [
      {
        title: 'Por que generics',
        blocks: [
          {
            kind: 'code',
            code: `public class Caixa<T> {
    private T conteudo;
    public void guardar(T item) { conteudo = item; }
    public T abrir() { return conteudo; }
}

Caixa<String> caixa = new Caixa<>();
caixa.guardar("livro");
String s = caixa.abrir();      // sem cast
caixa.guardar(42);             // erro de compilação: tipo errado`,
          },
          {
            kind: 'text',
            body: 'Generics movem erros de tipo da execução para a compilação e eliminam casts manuais.',
          },
        ],
      },
      {
        title: 'Métodos genéricos e limites',
        blocks: [
          {
            kind: 'code',
            code: `static <T extends Comparable<T>> T maior(List<T> lista) {
    T maior = lista.getFirst();
    for (T item : lista) {
        if (item.compareTo(maior) > 0) maior = item;
    }
    return maior;
}`,
          },
        ],
      },
      {
        title: 'Wildcards e PECS',
        blocks: [
          {
            kind: 'text',
            body: '**P**roducer **E**xtends, **C**onsumer **S**uper. Se a coleção só **fornece** valores, use `? extends T`. Se só **recebe** valores, use `? super T`.',
          },
          {
            kind: 'code',
            code: `double soma(List<? extends Number> numeros) {   // lê: aceita List<Integer>, List<Double>
    return numeros.stream().mapToDouble(Number::doubleValue).sum();
}

void preencher(List<? super Integer> destino) {  // escreve: aceita List<Number>, List<Object>
    destino.add(1);
    destino.add(2);
}`,
          },
          {
            kind: 'pitfall',
            body: 'Por causa do **type erasure**, o tipo genérico some em tempo de execução: não dá para fazer `new T()`, `T[]` ou `x instanceof List<String>`.',
          },
        ],
      },
    ],
    checklist: [
      'Criar uma classe genérica',
      'Escrever um método genérico com limite superior',
      'Aplicar PECS ao escolher wildcards',
    ],
    quiz: [
      {
        q: 'Um método só lê números de uma lista que pode ser de Integer ou Double. Qual assinatura usar?',
        options: ['List<Number>', 'List<? extends Number>', 'List<? super Number>', 'List<Object>'],
        answer: 1,
        why: 'List<Number> não aceita List<Integer>. Com ? extends Number, qualquer lista de subtipos de Number serve para leitura.',
      },
      {
        q: 'Por que List<int> não compila?',
        options: [
          'int é muito pequeno',
          'Generics só funcionam com tipos de referência',
          'Precisa ser List<long>',
          'List só aceita String',
        ],
        answer: 1,
        why: 'Parâmetros de tipo precisam ser objetos. Use o wrapper: List<Integer>.',
      },
    ],
  },
  {
    id: 'lambdas-streams',
    stage: 'intermediario',
    area: 'funcional',
    title: 'Lambdas e Streams',
    summary: 'Funções como valores e pipelines declarativos sobre coleções.',
    minutes: 18,
    signature: 'pedidos.stream().filter(Pedido::pago).toList()',
    sections: [
      {
        title: 'Lambdas e referências de método',
        blocks: [
          {
            kind: 'code',
            code: `Predicate<String> vazio = s -> s.isBlank();
Function<String, Integer> tamanho = String::length;
Supplier<List<String>> nova = ArrayList::new;
Consumer<String> imprimir = System.out::println;
BinaryOperator<Integer> soma = Integer::sum;`,
          },
          {
            kind: 'text',
            body: 'O pacote `java.util.function` traz as interfaces funcionais mais comuns. Procure nele antes de criar a sua.',
          },
        ],
      },
      {
        title: 'O pipeline',
        blocks: [
          {
            kind: 'text',
            body: 'Um stream tem **fonte** → operações **intermediárias** (preguiçosas) → uma operação **terminal**, que dispara o processamento.',
          },
          {
            kind: 'code',
            code: `record Pedido(String cliente, String status, BigDecimal valor) {}

Map<String, BigDecimal> totalPorCliente = pedidos.stream()
    .filter(p -> p.status().equals("PAGO"))
    .collect(Collectors.groupingBy(
        Pedido::cliente,
        Collectors.reducing(BigDecimal.ZERO, Pedido::valor, BigDecimal::add)));

List<String> top3 = pedidos.stream()
    .sorted(Comparator.comparing(Pedido::valor).reversed())
    .limit(3)
    .map(Pedido::cliente)
    .toList();                    // Java 16: lista imutável`,
          },
        ],
      },
      {
        title: 'Regras de ouro',
        blocks: [
          {
            kind: 'list',
            items: [
              'Um stream só pode ser consumido uma vez.',
              'Sem operação terminal, nada é executado.',
              'Evite efeitos colaterais dentro de `map` e `filter`.',
              '`parallelStream()` só compensa com muito dado e trabalho de CPU. Meça antes.',
            ],
          },
          {
            kind: 'code',
            code: `// Java 24: gatherers para operações intermediárias sob medida
Stream.of(1, 2, 3, 4, 5, 6, 7)
    .gather(Gatherers.windowFixed(3))
    .toList();   // [[1, 2, 3], [4, 5, 6], [7]]`,
          },
        ],
      },
    ],
    checklist: [
      'Escrever lambdas e referências de método',
      'Montar um pipeline com filter, map e collect',
      'Agrupar dados com Collectors.groupingBy',
    ],
    quiz: [
      {
        q: 'O que este código imprime?',
        code: `Stream.of(1, 2, 3).filter(n -> {
    System.out.println(n);
    return true;
});`,
        options: ['1 2 3', 'Nada', '1', 'Lança exceção'],
        answer: 1,
        why: 'filter é intermediária e preguiçosa. Sem uma operação terminal como toList(), o pipeline nunca roda.',
      },
      {
        q: 'Qual interface funcional representa x -> x > 10, com x inteiro?',
        options: ['Function<Integer, Integer>', 'Supplier<Boolean>', 'Predicate<Integer>', 'Consumer<Integer>'],
        answer: 2,
        why: 'Predicate<T> recebe um T e devolve boolean.',
      },
    ],
  },
  {
    id: 'optional-datas',
    stage: 'intermediario',
    area: 'funcional',
    title: 'Optional e datas',
    summary: 'Ausência de valor sem null e a API java.time.',
    minutes: 12,
    signature: 'repo.buscar(id).orElseThrow()',
    sections: [
      {
        title: 'Optional',
        blocks: [
          {
            kind: 'code',
            code: `Optional<Usuario> buscar(long id) { ... }

String nome = buscar(7)
    .map(Usuario::nome)
    .orElse("visitante");

Usuario u = buscar(7).orElseThrow(() -> new NaoEncontrado(7));

buscar(7).ifPresentOrElse(
    usuario -> enviarBoasVindas(usuario),
    () -> log.warn("usuário 7 não existe"));`,
          },
          {
            kind: 'list',
            items: [
              'Use Optional como **tipo de retorno** de buscas que podem não achar nada.',
              'Não use em campos, parâmetros ou coleções.',
              'Nunca chame `get()` sem saber que há valor. Prefira `orElseThrow()`.',
            ],
          },
          {
            kind: 'pitfall',
            body: '`orElse(criarPadrao())` sempre executa `criarPadrao()`, mesmo com valor presente. Para algo caro, use `orElseGet(() -> criarPadrao())`.',
          },
        ],
      },
      {
        title: 'java.time',
        blocks: [
          {
            kind: 'code',
            code: `LocalDate hoje = LocalDate.now();
LocalDate vencimento = hoje.plusDays(30);
long dias = ChronoUnit.DAYS.between(hoje, vencimento);   // 30

String br = vencimento.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

Instant agora = Instant.now();                            // ponto exato, em UTC
ZonedDateTime sp = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
Duration reuniao = Duration.ofMinutes(90);`,
          },
          {
            kind: 'list',
            items: [
              '`LocalDate` / `LocalDateTime`: data e hora sem fuso, como "aniversário".',
              '`Instant`: momento exato na linha do tempo, ideal para logs e banco.',
              '`ZonedDateTime`: data e hora em um fuso específico.',
              '`Duration` mede tempo; `Period` mede dias, meses e anos.',
            ],
          },
          {
            kind: 'tip',
            body: 'Todas as classes de `java.time` são imutáveis e thread-safe. Evite `Date`, `Calendar` e `SimpleDateFormat` em código novo.',
          },
        ],
      },
    ],
    checklist: [
      'Encadear map e orElseThrow em um Optional',
      'Calcular diferenças entre datas',
      'Escolher entre LocalDateTime e Instant',
    ],
    quiz: [
      {
        q: 'Qual a diferença entre orElse e orElseGet?',
        options: [
          'Nenhuma',
          'orElseGet só executa o fornecedor quando o Optional está vazio',
          'orElse lança exceção quando vazio',
          'orElseGet só aceita String',
        ],
        answer: 1,
        why: 'O argumento de orElse é avaliado sempre, antes da chamada. orElseGet recebe uma função e só a chama se precisar.',
      },
      {
        q: 'Qual tipo usar para registrar o momento exato de um evento no servidor?',
        options: ['LocalDate', 'LocalDateTime', 'Instant', 'Period'],
        answer: 2,
        why: 'Instant representa um ponto absoluto em UTC, sem ambiguidade de fuso horário.',
      },
    ],
  },

  // ───────────────────────────── Avançado ─────────────────────────────
  {
    id: 'concorrencia',
    stage: 'avancado',
    area: 'concorrencia',
    title: 'Concorrência e virtual threads',
    summary: 'Condições de corrida, executores, CompletableFuture e threads virtuais.',
    minutes: 20,
    signature: 'Executors.newVirtualThreadPerTaskExecutor()',
    sections: [
      {
        title: 'O problema',
        blocks: [
          {
            kind: 'code',
            code: `class Contador {
    private int valor = 0;
    void incrementar() { valor++; }   // ler, somar, gravar: três passos
}
// Duas threads chamando incrementar() 1000 vezes cada
// podem terminar com valor < 2000.`,
          },
          {
            kind: 'text',
            body: 'Quando duas threads leem o mesmo valor antes de gravar, um incremento se perde. Isso é uma **condição de corrida**.',
          },
          {
            kind: 'code',
            code: `private final AtomicInteger valor = new AtomicInteger();
void incrementar() { valor.incrementAndGet(); }        // atômico

synchronized void transferir(Conta destino, BigDecimal v) { ... } // exclusão mútua

Map<String, Integer> cache = new ConcurrentHashMap<>();`,
          },
        ],
      },
      {
        title: 'Executores e CompletableFuture',
        blocks: [
          {
            kind: 'code',
            code: `CompletableFuture<Usuario> usuario = CompletableFuture.supplyAsync(() -> api.usuario(id));
CompletableFuture<List<Pedido>> pedidos = CompletableFuture.supplyAsync(() -> api.pedidos(id));

Painel painel = usuario
    .thenCombine(pedidos, Painel::new)
    .orTimeout(2, TimeUnit.SECONDS)
    .join();`,
          },
          {
            kind: 'tip',
            body: 'Não crie `new Thread()` manualmente em código de aplicação. Use um `ExecutorService` para controlar o ciclo de vida das threads.',
          },
        ],
      },
      {
        title: 'Virtual threads (Java 21)',
        blocks: [
          {
            kind: 'code',
            code: `// dentro de um método que declara throws Exception
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> respostas = urls.stream()
        .map(url -> executor.submit(() -> baixar(url)))
        .toList();
    for (var resposta : respostas) {
        System.out.println(resposta.get());
    }
}   // close() espera todas as tarefas terminarem`,
          },
          {
            kind: 'text',
            body: 'Threads virtuais são baratas: dá para ter milhões. Quando uma delas bloqueia em I/O, a JVM libera a thread do sistema operacional para outra tarefa. Desde o Java 24, `synchronized` também não prende mais a thread do sistema.',
          },
          {
            kind: 'pitfall',
            body: 'Threads virtuais aceleram trabalho que **espera** (rede, banco, disco). Para cálculo pesado de CPU, um pool de tamanho fixo continua sendo a escolha certa. Também não faz sentido criar um pool de threads virtuais.',
          },
        ],
      },
    ],
    checklist: [
      'Explicar uma condição de corrida',
      'Usar AtomicInteger e ConcurrentHashMap',
      'Saber quando threads virtuais ajudam',
    ],
    quiz: [
      {
        q: 'Duas threads executam contador++ 1000 vezes cada, sem sincronização. O resultado é:',
        options: ['Sempre 2000', 'Pode ser menor que 2000', 'Sempre 1000', 'Erro de compilação'],
        answer: 1,
        why: 'contador++ não é atômico. Incrementos simultâneos podem sobrescrever um ao outro.',
      },
      {
        q: 'Threads virtuais são mais indicadas para:',
        options: [
          'Cálculos matemáticos intensivos',
          'Muitas tarefas que passam a maior parte do tempo esperando I/O',
          'Substituir o garbage collector',
          'Programas de uma única thread',
        ],
        answer: 1,
        why: 'O ganho vem de liberar a thread do sistema enquanto a tarefa espera. Em trabalho de CPU não há espera para aproveitar.',
      },
    ],
  },
  {
    id: 'jvm',
    stage: 'avancado',
    area: 'jvm',
    title: 'JVM por dentro',
    summary: 'Memória, garbage collectors, JIT e as ferramentas de diagnóstico.',
    minutes: 16,
    signature: 'java -XX:+UseZGC -Xmx2g -jar app.jar',
    sections: [
      {
        title: 'Memória',
        blocks: [
          {
            kind: 'list',
            items: [
              '**Stack**: uma por thread. Guarda os frames de cada chamada, com variáveis locais e primitivos.',
              '**Heap**: compartilhada. Todo objeto criado com `new` vive aqui.',
              '**Metaspace**: metadados das classes carregadas (substituiu a PermGen no Java 8).',
            ],
          },
          {
            kind: 'pitfall',
            body: '`StackOverflowError` indica recursão profunda demais. `OutOfMemoryError: Java heap space` indica heap pequena ou objetos que nunca são liberados (vazamento).',
          },
        ],
      },
      {
        title: 'Garbage collection',
        blocks: [
          {
            kind: 'text',
            body: 'O GC libera objetos que não são mais alcançáveis. A maioria morre jovem, por isso os coletores separam a heap em gerações.',
          },
          {
            kind: 'list',
            items: [
              '**G1**: padrão desde o Java 9. Equilibra latência e throughput.',
              '**ZGC**: pausas abaixo de um milissegundo, mesmo com heaps enormes.',
              '**Parallel**: maior throughput, ideal para processamento em lote.',
            ],
          },
          {
            kind: 'code',
            lang: 'shell',
            code: `java -Xms512m -Xmx2g -XX:+UseZGC -jar app.jar
jcmd <pid> GC.heap_info
jcmd <pid> JFR.start duration=60s filename=gravacao.jfr`,
          },
        ],
      },
      {
        title: 'JIT e carregamento de classes',
        blocks: [
          {
            kind: 'text',
            body: 'A JVM começa interpretando o bytecode e mede o que roda mais. Os pontos quentes são compilados pelo **C1** (rápido) e depois pelo **C2** (otimizado). Por isso a aplicação fica mais rápida após o aquecimento.',
          },
          {
            kind: 'text',
            body: 'Classes são carregadas sob demanda por class loaders em camadas: bootstrap (núcleo do JDK), platform e application (seu classpath).',
          },
          {
            kind: 'tip',
            body: 'Para investigar desempenho, grave com o **Java Flight Recorder** e analise no **JDK Mission Control**. Os dois são gratuitos e o custo em produção é baixo.',
          },
        ],
      },
    ],
    checklist: [
      'Explicar a diferença entre stack e heap',
      'Citar dois garbage collectors e quando usar',
      'Gravar um perfil com JFR',
    ],
    quiz: [
      {
        q: 'Onde ficam os objetos criados com new?',
        options: ['Na stack da thread', 'Na heap', 'No metaspace', 'No registrador da CPU'],
        answer: 1,
        why: 'Objetos ficam na heap. A stack guarda apenas a referência, se ela for uma variável local.',
      },
      {
        q: 'Qual é o garbage collector padrão nas JVMs modernas?',
        options: ['Serial', 'ZGC', 'G1', 'CMS'],
        answer: 2,
        why: 'O G1 é o padrão desde o Java 9. O CMS foi removido no Java 14.',
      },
    ],
  },
  {
    id: 'pattern-matching',
    stage: 'avancado',
    area: 'poo',
    title: 'Pattern matching moderno',
    summary: 'instanceof com padrão, switch exaustivo, record patterns e guards.',
    minutes: 14,
    signature: 'case Circulo(double r) -> Math.PI * r * r;',
    sections: [
      {
        title: 'instanceof com padrão',
        blocks: [
          {
            kind: 'code',
            code: `// antes
if (obj instanceof String) {
    String s = (String) obj;
    ...
}

// Java 16+
if (obj instanceof String s && !s.isBlank()) {
    System.out.println(s.length());
}`,
          },
        ],
      },
      {
        title: 'switch exaustivo com sealed e records',
        blocks: [
          {
            kind: 'code',
            code: `sealed interface Forma permits Circulo, Quadrado, Retangulo {}
record Circulo(double raio) implements Forma {}
record Quadrado(double lado) implements Forma {}
record Retangulo(double largura, double altura) implements Forma {}

static double area(Forma forma) {
    return switch (forma) {
        case Circulo(double r)             -> Math.PI * r * r;
        case Quadrado(double l)            -> l * l;
        case Retangulo(double w, double h) -> w * h;
    };   // sem default: o compilador sabe que cobrimos tudo
}`,
          },
          {
            kind: 'text',
            body: 'Se alguém adicionar `Triangulo` à interface selada, todo switch que não trata o novo caso deixa de compilar. O compilador vira seu revisor.',
          },
        ],
      },
      {
        title: 'Guards e variáveis sem nome',
        blocks: [
          {
            kind: 'code',
            code: `String descrever(Forma forma) {
    return switch (forma) {
        case Circulo c when c.raio() == 0 -> "ponto";
        case Circulo c                    -> "círculo";
        case Retangulo(double w, _)       -> "retângulo de largura " + w; // Java 22
        case Quadrado _                   -> "quadrado";
    };
}`,
          },
          {
            kind: 'pitfall',
            body: 'A ordem importa: um caso com `when` precisa vir antes do caso geral do mesmo tipo. Caso contrário, o compilador acusa que ele nunca será alcançado.',
          },
        ],
      },
    ],
    checklist: [
      'Usar instanceof com padrão',
      'Escrever um switch exaustivo sobre uma interface selada',
      'Desestruturar records com record patterns',
    ],
    quiz: [
      {
        q: 'Por que o switch sobre uma interface selada pode dispensar o default?',
        options: [
          'Porque default é proibido em switch de padrões',
          'Porque o compilador conhece todos os subtipos e verifica a exaustividade',
          'Porque a JVM ignora casos não tratados',
          'Porque records nunca são nulos',
        ],
        answer: 1,
        why: 'Com sealed, a lista de subtipos é fechada. Se todos estão cobertos, o switch é exaustivo.',
      },
      {
        q: 'O que significa _ em case Retangulo(double w, _)?',
        options: [
          'Qualquer número',
          'Um componente que será ignorado',
          'Um erro de sintaxe',
          'O valor padrão do record',
        ],
        answer: 1,
        why: 'Variáveis e padrões sem nome (Java 22) indicam que aquele componente não será usado.',
      },
    ],
  },

  // ───────────────────────────── Ecossistema ─────────────────────────────
  {
    id: 'build-tools',
    stage: 'ecossistema',
    area: 'ecossistema',
    title: 'Maven e Gradle',
    summary: 'Estrutura de projeto, dependências e o ciclo de build.',
    minutes: 12,
    signature: 'mvn clean verify',
    sections: [
      {
        title: 'Estrutura padrão',
        blocks: [
          {
            kind: 'code',
            lang: 'shell',
            code: `meu-projeto/
├── pom.xml                  # ou build.gradle.kts
└── src/
    ├── main/java/           # código da aplicação
    ├── main/resources/      # configurações
    └── test/java/           # testes`,
          },
          {
            kind: 'text',
            body: 'Maven e Gradle usam a mesma estrutura. Seguir a convenção significa quase zero configuração.',
          },
        ],
      },
      {
        title: 'Maven',
        blocks: [
          {
            kind: 'code',
            lang: 'xml',
            code: `<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.13.4</version>
    <scope>test</scope>
</dependency>`,
            caption: 'pom.xml — confira a versão mais recente no Maven Central',
          },
          {
            kind: 'list',
            items: [
              'Ciclo: `validate` → `compile` → `test` → `package` → `verify` → `install` → `deploy`.',
              'Rodar uma fase executa todas as anteriores.',
              'Escopos: `compile` (padrão), `test`, `provided` e `runtime`.',
            ],
          },
        ],
      },
      {
        title: 'Gradle',
        blocks: [
          {
            kind: 'code',
            lang: 'shell',
            code: `./gradlew build        # compila, testa e empacota
./gradlew test --continuous
./gradlew dependencies # árvore de dependências`,
          },
          {
            kind: 'tip',
            body: 'Sempre use o wrapper (`./mvnw` ou `./gradlew`) que fica no repositório. Todo mundo do time, e o CI, usa a mesma versão da ferramenta.',
          },
        ],
      },
    ],
    checklist: [
      'Criar um projeto com a estrutura padrão',
      'Adicionar uma dependência com o escopo correto',
      'Rodar o build completo pelo wrapper',
    ],
    quiz: [
      {
        q: 'Qual comando Maven compila, roda os testes e gera o .jar?',
        options: ['mvn compile', 'mvn package', 'mvn clean', 'mvn run'],
        answer: 1,
        why: 'package executa as fases anteriores (compile e test) e empacota o resultado.',
      },
      {
        q: 'Para que serve o Gradle Wrapper (gradlew)?',
        options: [
          'Deixar o build mais rápido',
          'Garantir que todos usem a mesma versão do Gradle, sem instalação manual',
          'Converter projetos Maven',
          'Rodar a aplicação em produção',
        ],
        answer: 1,
        why: 'O wrapper baixa e usa a versão fixada no projeto, o que torna o build reproduzível.',
      },
    ],
  },
  {
    id: 'testes',
    stage: 'ecossistema',
    area: 'ecossistema',
    title: 'Testes com JUnit e Mockito',
    summary: 'Testes de unidade, parametrizados e dublês de dependências.',
    minutes: 15,
    signature: 'assertThrows(ArithmeticException.class, () -> calc.dividir(1, 0));',
    sections: [
      {
        title: 'JUnit Jupiter',
        blocks: [
          {
            kind: 'code',
            code: `class CalculadoraTest {
    private final Calculadora calc = new Calculadora();

    @Test
    void somaDoisNumeros() {
        assertEquals(5, calc.somar(2, 3));
    }

    @ParameterizedTest
    @CsvSource({"10, 2, 5", "9, 3, 3", "7, 7, 1"})
    void divide(int a, int b, int esperado) {
        assertEquals(esperado, calc.dividir(a, b));
    }

    @Test
    void divisaoPorZeroLancaExcecao() {
        assertThrows(ArithmeticException.class, () -> calc.dividir(1, 0));
    }
}`,
          },
          {
            kind: 'text',
            body: 'O JUnit 5 e o JUnit 6 compartilham a mesma API Jupiter (`org.junit.jupiter.api`). Organize cada teste em **Arrange, Act, Assert**: preparar, executar e verificar.',
          },
        ],
      },
      {
        title: 'Mockito',
        blocks: [
          {
            kind: 'code',
            code: `@ExtendWith(MockitoExtension.class)
class CadastroServiceTest {
    @Mock UsuarioRepository repo;
    @InjectMocks CadastroService service;

    @Test
    void recusaEmailDuplicado() {
        when(repo.existePorEmail("ana@ex.com")).thenReturn(true);

        assertThrows(EmailEmUso.class, () -> service.cadastrar("ana@ex.com"));
        verify(repo, never()).salvar(any());
    }
}`,
          },
          {
            kind: 'tip',
            body: 'Use mocks nas fronteiras (banco, rede, relógio). Mockar tudo deixa os testes frágeis e acoplados à implementação.',
          },
        ],
      },
      {
        title: 'Estratégia',
        blocks: [
          {
            kind: 'list',
            items: [
              'Muitos testes de unidade, rápidos e isolados.',
              'Alguns testes de integração, com banco real em container (Testcontainers).',
              'Poucos testes ponta a ponta.',
              'TDD: escreva o teste falhando, faça passar, refatore.',
            ],
          },
        ],
      },
    ],
    checklist: [
      'Escrever testes com assertEquals e assertThrows',
      'Criar um teste parametrizado',
      'Isolar uma dependência com Mockito',
    ],
    quiz: [
      {
        q: 'Para que serve assertThrows?',
        options: [
          'Ignorar exceções no teste',
          'Verificar que um trecho de código lança a exceção esperada',
          'Lançar uma exceção para encerrar o teste',
          'Repetir o teste até passar',
        ],
        answer: 1,
        why: 'O teste passa somente se a lambda lançar a exceção do tipo informado.',
      },
      {
        q: 'Qual o objetivo de um mock?',
        options: [
          'Acelerar o código de produção',
          'Substituir uma dependência para testar a unidade isoladamente',
          'Gerar dados aleatórios',
          'Medir cobertura de código',
        ],
        answer: 1,
        why: 'O mock simula a dependência e permite controlar respostas e verificar interações.',
      },
    ],
  },
  {
    id: 'spring-boot',
    stage: 'ecossistema',
    area: 'ecossistema',
    title: 'Spring Boot essencial',
    summary: 'Injeção de dependência, APIs REST e persistência com Spring Data.',
    minutes: 18,
    signature: '@RestController class TarefaController',
    sections: [
      {
        title: 'Inversão de controle',
        blocks: [
          {
            kind: 'text',
            body: 'O Spring cria seus objetos (beans) e entrega as dependências prontas. Você declara o que precisa no construtor e o container resolve. Spring Boot 3 e 4 exigem Java 17 ou mais recente.',
          },
          {
            kind: 'tip',
            body: 'Comece pelo **start.spring.io**: escolha Spring Web, Validation, Spring Data JPA e um banco. O projeto já vem configurado.',
          },
        ],
      },
      {
        title: 'Uma API REST',
        blocks: [
          {
            kind: 'code',
            code: `@RestController
@RequestMapping("/tarefas")
class TarefaController {
    private final TarefaService service;

    TarefaController(TarefaService service) {   // injeção pelo construtor
        this.service = service;
    }

    @GetMapping
    List<Tarefa> listar() {
        return service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Tarefa criar(@RequestBody @Valid NovaTarefa dados) {
        return service.criar(dados);
    }
}`,
          },
          {
            kind: 'text',
            body: '`@RestController` combina `@Controller` e `@ResponseBody`: o retorno dos métodos é serializado como JSON.',
          },
        ],
      },
      {
        title: 'Persistência',
        blocks: [
          {
            kind: 'code',
            code: `@Entity
class Tarefa {
    @Id @GeneratedValue Long id;
    String titulo;
    boolean concluida;
}

interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    List<Tarefa> findByConcluidaFalse();   // a consulta vem do nome do método
}`,
          },
          {
            kind: 'pitfall',
            body: 'Não exponha entidades JPA direto na API. Use records como DTOs de entrada e saída para não vazar campos internos nem criar dependência entre banco e contrato.',
          },
        ],
      },
    ],
    checklist: [
      'Gerar um projeto pelo start.spring.io',
      'Criar endpoints GET e POST com validação',
      'Persistir dados com um JpaRepository',
    ],
    quiz: [
      {
        q: 'Qual forma de injeção de dependência é recomendada no Spring?',
        options: ['Por campo com @Autowired', 'Pelo construtor', 'Por setter', 'Com new dentro da classe'],
        answer: 1,
        why: 'Pelo construtor, as dependências podem ser final, ficam explícitas e o teste não precisa do Spring para instanciar a classe.',
      },
      {
        q: '@RestController é equivalente a:',
        options: [
          '@Service + @Repository',
          '@Controller + @ResponseBody',
          '@Component + @Bean',
          '@Configuration + @Controller',
        ],
        answer: 1,
        why: 'Ela marca a classe como controlador e serializa o retorno de cada método no corpo da resposta.',
      },
    ],
  },
  {
    id: 'boas-praticas',
    stage: 'ecossistema',
    area: 'ecossistema',
    title: 'Boas práticas e padrões',
    summary: 'SOLID, padrões de projeto que ainda valem e código que outras pessoas entendem.',
    minutes: 14,
    signature: 'Map<String, Frete> estrategias',
    sections: [
      {
        title: 'SOLID em uma frase cada',
        blocks: [
          {
            kind: 'list',
            items: [
              '**S**ingle responsibility: uma classe, um motivo para mudar.',
              '**O**pen/closed: estenda comportamento sem editar código que funciona.',
              '**L**iskov: uma subclasse precisa funcionar onde a superclasse funciona.',
              '**I**nterface segregation: interfaces pequenas e específicas.',
              '**D**ependency inversion: dependa de abstrações, não de implementações.',
            ],
          },
        ],
      },
      {
        title: 'Strategy com lambdas',
        blocks: [
          {
            kind: 'code',
            code: `interface Frete {
    BigDecimal calcular(BigDecimal pesoKg);
}

Map<String, Frete> fretes = Map.of(
    "economico", peso -> peso.multiply(new BigDecimal("1.5")),
    "expresso",  peso -> peso.multiply(new BigDecimal("3.0")).add(BigDecimal.TEN));

BigDecimal valor = fretes.get(tipo).calcular(peso);`,
          },
          {
            kind: 'text',
            body: 'Um novo tipo de frete é uma linha no mapa, sem tocar no código que calcula. Outros padrões que continuam úteis: **Builder** para objetos com muitos campos opcionais, **Factory** para esconder qual implementação criar e **Observer** para eventos.',
          },
        ],
      },
      {
        title: 'Código legível',
        blocks: [
          {
            kind: 'list',
            items: [
              'Nomes que revelam intenção: `diasDesdeUltimoAcesso`, e não `d`.',
              'Métodos curtos que fazem uma coisa.',
              'Devolva coleção vazia em vez de `null`.',
              'Prefira objetos imutáveis.',
              'Use SLF4J para logs, não `System.out.println`.',
            ],
          },
          {
            kind: 'tip',
            body: 'Antes de abrir um pull request, leia o seu próprio diff como se fosse de outra pessoa. A maioria dos problemas aparece nessa leitura.',
          },
        ],
      },
    ],
    checklist: [
      'Explicar cada letra do SOLID com um exemplo',
      'Aplicar Strategy com lambdas',
      'Revisar o próprio código com um checklist',
    ],
    quiz: [
      {
        q: '"Uma classe deve ter apenas um motivo para mudar" descreve qual princípio?',
        options: ['Open/closed', 'Single responsibility', 'Liskov substitution', 'Dependency inversion'],
        answer: 1,
        why: 'É o S do SOLID: cada classe cuida de uma única responsabilidade.',
      },
      {
        q: 'O padrão Strategy serve para:',
        options: [
          'Garantir uma única instância',
          'Trocar o algoritmo usado em tempo de execução',
          'Copiar objetos complexos',
          'Notificar vários ouvintes',
        ],
        answer: 1,
        why: 'Cada estratégia implementa a mesma interface, e o código cliente escolhe qual usar sem conhecer os detalhes.',
      },
    ],
  },
]

export const MODULE_BY_ID: Record<string, Module> = Object.fromEntries(MODULES.map((m) => [m.id, m]))
