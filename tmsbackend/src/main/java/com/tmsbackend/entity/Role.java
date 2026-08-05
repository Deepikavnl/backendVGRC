import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;

    @Column(length = 255)
    private String description;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @OneToMany(mappedBy = "role")
    private List<User> users = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        createdDate = LocalDateTime.now();
    }
}