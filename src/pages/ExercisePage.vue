<template>
  <div class="exercise-page">
    <h1>题目练习</h1>
    <div class="exercise-list">
      <div v-for="(exercise, index) in exercises" :key="index" class="exercise-item">
        <div class="question">
          <span class="question-number">问题 {{ index + 1 }}:</span>
          {{ exercise.question }}
        </div>
        <button
          @click="toggleAnswer(index)"
          class="show-answer-btn"
        >
          {{ exercise.showAnswer ? '隐藏答案' : '显示答案' }}
        </button>
        <div v-if="exercise.showAnswer" class="answer">
          <strong>答案:</strong> {{ exercise.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExercisePage',
  data() {
    return {
      exercises: [
        {
          question: "什么是 Java 的垃圾回收机制？它是如何工作的？",
          answer: "Java 的垃圾回收机制是自动内存管理的一部分，它通过识别和回收不再使用的对象来释放内存。工作原理包括：1) 标记阶段识别哪些对象还在使用；2) 清除阶段回收未被标记的对象内存；3) 可选的内存整理阶段减少碎片。常见的垃圾回收算法有标记-清除、复制、标记-整理和分代收集。",
          showAnswer: false
        },
        {
          question: "解释 Java 中的 HashMap 工作原理",
          answer: "HashMap 基于哈希表实现，使用键值对存储数据。工作原理：1) 通过 hashCode() 计算键的哈希值；2) 使用哈希函数确定存储位置；3) 处理哈希冲突（链表或红黑树）；4) 当元素数量超过阈值时扩容。JDK8 后，当链表长度超过8时会转为红黑树以提高查询效率。",
          showAnswer: false
        },
        {
          question: "Spring 框架中的依赖注入有哪几种方式？",
          answer: "Spring 中的依赖注入主要有三种方式：1) 构造器注入 - 通过构造函数传递依赖；2) Setter 注入 - 通过 setter 方法注入；3) 字段注入 - 使用 @Autowired 注解直接注入字段。推荐使用构造器注入，因为它更明确且有利于不可变对象和测试。",
          showAnswer: false
        },
        {
          question: "什么是 Java 中的 volatile 关键字？它解决了什么问题？",
          answer: "volatile 关键字保证了变量的可见性和有序性。解决的问题：1) 可见性问题 - 确保一个线程对变量的修改对其他线程立即可见；2) 禁止指令重排序 - 防止 JVM 优化重排。但它不保证原子性，对于复合操作仍需使用 synchronized 或原子类。",
          showAnswer: false
        },
        {
          question: "解释 MySQL 中的事务隔离级别及其解决的问题",
          answer: "MySQL 有四种隔离级别：1) 读未提交 - 可能脏读；2) 读已提交 - 解决脏读；3) 可重复读 - 解决不可重复读（MySQL 默认）；4) 串行化 - 解决幻读。InnoDB 在可重复读级别通过 MVCC 和间隙锁也能防止大部分幻读情况。",
          showAnswer: false
        },
        {
          question: "Spring Boot 自动配置是如何工作的？",
          answer: "Spring Boot 自动配置通过 @EnableAutoConfiguration 触发，工作原理：1) 扫描 META-INF/spring.factories 中的自动配置类；2) 根据类路径、Bean 存在等条件(@Conditional)决定是否应用配置；3) 创建并注册符合条件的 Bean。开发者可以通过 application.properties 或自定义配置覆盖默认值。",
          showAnswer: false
        },
        {
          question: "什么是 Redis 的持久化机制？比较 RDB 和 AOF 的优缺点",
          answer: "Redis 提供两种持久化：1) RDB - 定时快照，优点：文件紧凑、恢复快；缺点：可能丢失最后一次快照后的数据。2) AOF - 记录写命令，优点：更持久、可读；缺点：文件大、恢复慢。生产环境通常结合使用，用 AOF 保证数据安全，用 RDB 方便备份。",
          showAnswer: false
        },
        {
          question: "解释 Java 中的线程池工作原理及其核心参数",
          answer: "线程池工作原理：1) 提交任务；2) 核心线程处理；3) 任务队列存储；4) 创建非核心线程(当队列满)；5) 拒绝策略(当线程达最大且队列满)。核心参数：corePoolSize(核心线程数)、maximumPoolSize(最大线程数)、keepAliveTime(空闲线程存活时间)、workQueue(任务队列)、handler(拒绝策略)。",
          showAnswer: false
        }
      ]
    }
  },
  methods: {
    toggleAnswer(index) {
      this.exercises[index].showAnswer = !this.exercises[index].showAnswer;
    }
  }
}
</script>

<style scoped>
.exercise-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.exercise-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question {
  font-size: 18px;
  margin-bottom: 15px;
  line-height: 1.6;
}

.question-number {
  font-weight: bold;
  color: #3498db;
}

.show-answer-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.show-answer-btn:hover {
  background-color: #2980b9;
}

.answer {
  margin-top: 15px;
  padding: 15px;
  background-color: #e8f4fc;
  border-left: 4px solid #3498db;
  border-radius: 4px;
  line-height: 1.6;
}
</style>
